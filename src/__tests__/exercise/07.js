// testing with context and a custom render method
// http://localhost:3000/easy-button

import * as React from 'react'
import EasyButton from '../../components/easy-button'
import {render, screen} from 'test/test-utils'

// function renderWithTheme(ui, {theme = 'light', ...options} = {}) {
//   const Wrapper = ({children}) => (
//     <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
//   )

//   return render(ui, {wrapper: Wrapper, ...options})
// }

test('renders with the light styles for the light theme', () => {
  // 🐨 update the `render` call to use the wrapper option using the
  // ThemeProvider
  render(<EasyButton>Easy</EasyButton>)

  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})

test('renders with the dark styles for the dark theme', () => {
  render(<EasyButton>Easy</EasyButton>, {theme: 'dark'})

  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: black;
    color: white;
  `)
})

/* eslint no-unused-vars:0 */
