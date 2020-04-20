import { addDecorator } from '@storybook/react'
import { withThemesProvider } from 'storybook-addon-emotion-theme'
import theme from '../src/styles/theme'

const themes = [theme]
addDecorator(withThemesProvider(themes))
