import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { INITIAL_ORDER_STATE, OrderEventTrigger, OrderState } from 'src/util/enums'
import * as fileUtil from 'src/util/file'
import * as S3 from 'src/util/s3'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { mocked } from 'ts-jest/utils'
import OrderEvent from './OrderEvent'
import PrintSpec from 'src/lib/print-spec'
import Order from 'src/models/Order'
import { Result } from 'src/util/error'

jest.mock('src/util/file')
const mockedFileUtil = mocked(fileUtil)
jest.mock('src/lib/print-spec')
const mockedPrintSpec = mocked(PrintSpec)
jest.mock('src/util/s3')
const mockedS3Module = mocked(S3)

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('Order model', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('creating a new order', () => {
    it('detects a shortId collision and retries', async () => {
      const order1 = await createMockOrder({ shortId: 'SJC123' })
      const order2 = await createMockOrder({ shortId: 'SJC123' })
      expect(order1.shortId).toBe('SJC123')
      expect(order1.shortId).not.toEqual(order2.shortId)
    })
  })

  describe('cancelOrder', () => {
    it.each([OrderState.Captured, OrderState.Actionable, OrderState.Reviewed])(
      `successfully cancels the order if it's in the %s state`,
      async (initialState) => {
        const order = await createMockOrder({ state: initialState })
        expect(order.state).toBe(initialState)
        await order.transition(OrderState.Canceled)
        expect(order.state).toBe(OrderState.Canceled)
      }
    )

    it.each([OrderState.Creating, OrderState.Created, OrderState.Enroute, OrderState.Fulfilled])(
      `fails to cancel the order if it's in the %s state`,
      async (initialState) => {
        const order = await createMockOrder({ state: initialState })
        expect(order.state).toBe(initialState)
        const result = await order.transition(OrderState.Canceled)
        expect(result.error.name).toBe('invalid-transition')
        expect(order.state).toBe(initialState)
      }
    )
  })

  describe('transitionState', () => {
    it('Goes through full Order State Machine', async () => {
      const order = await createMockOrder()
      expect(order.state).toBe(INITIAL_ORDER_STATE)

      await order.transition(OrderState.Actionable, OrderEventTrigger.Payment)
      expect(order.state).toBe(OrderState.Actionable)

      await order.transition(OrderState.Reviewed, OrderEventTrigger.Internal)
      expect(order.state).toBe(OrderState.Reviewed)

      await order.transition(OrderState.Creating)
      expect(order.state).toBe(OrderState.Creating)

      await order.transition(OrderState.Created, OrderEventTrigger.Printer)
      expect(order.state).toBe(OrderState.Created)

      await order.transition(OrderState.Enroute)
      expect(order.state).toBe(OrderState.Enroute)

      await order.transition(OrderState.Fulfilled, OrderEventTrigger.Transport)
      expect(order.state).toBe(OrderState.Fulfilled)

      // Check that all OrderEvents are in the right order, with the right history
      const orderEvents = await OrderEvent.mongo.find({ order: order.id }).sort({ createdAt: 1 })
      expect(orderEvents).toEqual([
        expect.objectContaining({
          state: INITIAL_ORDER_STATE,
          trigger: OrderEventTrigger.Nomus,
        }),
        expect.objectContaining({
          state: OrderState.Actionable,
          trigger: OrderEventTrigger.Payment,
        }),
        expect.objectContaining({
          state: OrderState.Reviewed,
          trigger: OrderEventTrigger.Internal,
        }),
        expect.objectContaining({
          state: OrderState.Creating,
          trigger: OrderEventTrigger.Nomus,
        }),
        expect.objectContaining({
          state: OrderState.Created,
          trigger: OrderEventTrigger.Printer,
        }),
        expect.objectContaining({
          state: OrderState.Enroute,
          trigger: OrderEventTrigger.Nomus,
        }),
        expect.objectContaining({
          state: OrderState.Fulfilled,
          trigger: OrderEventTrigger.Transport,
        }),
      ])
    })
    it('Tries to do an improper state transition and fails', async () => {
      const order = await createMockOrder()
      const res = await order.transition(OrderState.Fulfilled)
      expect(order.state).toBe(INITIAL_ORDER_STATE)
      expect(res.isSuccess).toBe(false)
      expect(res.error.name).toBe('invalid-transition')

      const orderEvents = await OrderEvent.mongo.find({ order: order.id }).sort({ createdAt: 1 })
      expect(orderEvents).toEqual([
        expect.objectContaining({
          state: INITIAL_ORDER_STATE,
          trigger: OrderEventTrigger.Nomus,
        }),
      ])
    })
  })

  describe('updatePrintSpecPDF', () => {
    it('does not run if backImageUrl is empty', async () => {
      const cardVersion = await createMockCardVersion({
        frontImageUrl: 'https://s3.com/front.png',
        backImageUrl: undefined,
      })

      const order = await createMockOrder({ cardVersion, quantity: 75 })
      mockedFileUtil.downloadUrlToFile.mockImplementation((url, filename, tmpDirName) =>
        Promise.resolve(`/tmp/${tmpDirName}/${filename}`)
      )
      const generatePDFSpy = jest
        .spyOn(PrintSpec.prototype, 'generatePDF')
        .mockResolvedValue('/path/to/print-spec.pdf')

      const s3Key = `${order.shortId}-card-array.pdf`
      mockedS3Module.uploadFileToS3.mockResolvedValue(Result.ok(s3Key))

      // Make the call
      await order.updatePrintSpecPDF()

      expect(mockedFileUtil.downloadUrlToFile).toHaveBeenCalledTimes(0)
      expect(mockedFileUtil.downloadUrlToFile).toHaveBeenCalledTimes(0)

      expect(mockedPrintSpec).toHaveBeenCalledTimes(0)
      expect(generatePDFSpy).toHaveBeenCalledTimes(0)

      expect(mockedS3Module.uploadFileToS3).toHaveBeenCalledTimes(0)

      const updatedOrder = await Order.mongo.findOne({ _id: order.id })
      expect(updatedOrder.printSpecUrl).toBeUndefined()
    })

    it('generates a print spec PDF and uploads to S3', async () => {
      const cardVersion = await createMockCardVersion({
        frontImageUrl: 'https://s3.com/front.png',
        backImageUrl: 'https://s3.com/back.png',
      })
      const order = await createMockOrder({ cardVersion, quantity: 75 })
      mockedFileUtil.downloadUrlToFile.mockImplementation((url, filename, tmpDirName) =>
        Promise.resolve(`/tmp/${tmpDirName}/${filename}`)
      )
      const generatePDFSpy = jest
        .spyOn(PrintSpec.prototype, 'generatePDF')
        .mockResolvedValue('/path/to/print-spec.pdf')

      const s3Key = `${order.shortId}-card-array.pdf`
      mockedS3Module.uploadFileToS3.mockResolvedValue(Result.ok(s3Key))

      // Make the call
      await order.updatePrintSpecPDF()

      expect(mockedFileUtil.downloadUrlToFile).toHaveBeenCalledWith(
        cardVersion.frontImageUrl,
        'front.png',
        'card-images'
      )
      expect(mockedFileUtil.downloadUrlToFile).toHaveBeenCalledWith(
        cardVersion.backImageUrl,
        'back.png',
        'card-images'
      )

      expect(mockedPrintSpec).toHaveBeenCalledWith(
        expect.objectContaining({
          frontImageLocalFilePath: expect.stringContaining('front.png'),
          backImageLocalFilePath: expect.stringContaining('back.png'),
          shortId: order.shortId,
        })
      )
      expect(generatePDFSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          numSheets: 3,
        })
      )

      expect(mockedS3Module.uploadFileToS3).toHaveBeenCalled()

      const updatedOrder = await Order.mongo.findOne({ _id: order.id })
      expect(updatedOrder.printSpecUrl).toBe(S3.getObjectUrl(s3Key))
    })
  })
})
