// mocking HTTP requests
// http://localhost:3000/login-submission

import {build, fake} from '@jackfranklin/test-data-bot'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {rest} from 'msw'
import {setupServer} from 'msw/lib/node'
import * as React from 'react'
import {handlers} from 'test/server-handlers'
import Login from '../../components/login-submission'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

// 🐨 get the server setup with an async function to handle the login POST request:
// you'll want to respond with an JSON object that has the username.
// 📜 https://mswjs.io/
const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
// 🐨 before all the tests, start the server with `server.listen()`
// 🐨 after all the tests, stop the server with `server.close()`

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)

  // 🐨 uncomment this and you'll start making the request!
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  // as soon as the user hits submit, we render a spinner to the screen. That
  // spinner has an aria-label of "loading" for accessibility purposes, so
  // 🐨 wait for the loading spinner to be removed using waitForElementToBeRemoved
  // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitforelementtoberemoved
  // Passing a callback, not an element, which is will call periodically until the element has been removed
  await waitForElementToBeRemoved(() => screen.getByLabelText('loading...'))

  // once the login is successful, then the loading spinner disappears and
  // we render the username.
  // 🐨 assert that the username is on the screen
  // Assert that there is an element on the screen with text matching the username
  expect(screen.getByText(username)).toBeInTheDocument()
})

test(`omitting password results in an error`, async () => {
  render(<Login />)
  const {username} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText('loading...'))

  // expect(screen.getByRole('alert')).toHaveTextContent('password required')
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

test(`unknown server error displays the error message`, async () => {
  const serverErrorMessage = 'something is very wrong'
  // your one-off handler here
  server.use(
    rest.post(
      // note that it's the same URL as our app-wide handler
      // so this will override the other.
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: serverErrorMessage}))
      },
    ),
  )

  render(<Login />)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText('loading...'))

  expect(screen.getByRole('alert')).toHaveTextContent(serverErrorMessage)
})
