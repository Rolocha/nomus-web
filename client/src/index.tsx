// Needed for @babel/preset-env because we set useBuiltIns: entry See
// https://babeljs.io/docs/en/babel-preset-env#usebuiltins and
// https://stackoverflow.com/questions/52625979/confused-about-usebuiltins-option-of-babel-preset-env-using-browserslist-integ
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
