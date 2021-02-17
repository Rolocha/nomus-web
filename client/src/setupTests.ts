// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

// Needed for @babel/preset-env because we set useBuiltIns: entry See
// https://babeljs.io/docs/en/babel-preset-env#usebuiltins and
// https://stackoverflow.com/questions/52625979/confused-about-usebuiltins-option-of-babel-preset-env-using-browserslist-integ
import 'core-js/stable'
import 'regenerator-runtime/runtime'
