import * as React from 'react'
import * as Sentry from '@sentry/react'
import CardBuilderWizard from './CardBuilderWizard'

interface Props {}

interface State {
  fatalError: Error | null
}

class CardBuilderWrapper extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { fatalError: null }
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { fatalError: error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error)
  }

  render() {
    return (
      <CardBuilderWizard
        fatalError={this.state.fatalError}
        setFatalError={(e: Error) => this.setState({ fatalError: e })}
      />
    )
  }
}

export default CardBuilderWrapper
