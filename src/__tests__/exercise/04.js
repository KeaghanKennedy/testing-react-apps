// form testing

import {build, fake} from '@jackfranklin/test-data-bot'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import faker from 'faker'
import * as React from 'react'
import Login from '../../components/Login'

// const buildLoginForm = overrides => ({
//   username: faker.internet.userName(),
//   password: faker.internet.password(),
//   ...overrides,
// })

const loginBuilder = build('Login', {
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

test('submitting the form calls onSubmit with username and password', async () => {
  // 🐨 create a variable called "submittedData" and a handleSubmit function that
  // accepts the data and assigns submittedData to the data that was submitted
  // 💰 if you need a hand, here's what the handleSubmit function should do:
  // const handleSubmit = data => (submittedData = data)
  // let submittedData
  // const handleSubmit = data => (submittedData = data)

  const handleSubmit = jest.fn()

  // 🐨 render the login with your handleSubmit function as the onSubmit prop
  render(<Login onSubmit={handleSubmit} />)

  const {username, password} = loginBuilder()

  // 🐨 get the username and password fields via `getByLabelText`
  // 🐨 use `await userEvent.type...` to change the username and password fields to
  //    whatever you want
  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)

  // 🐨 click on the button with the text "Submit"
  await userEvent.click(screen.getByText('Submit'))

  // assert that submittedData is correct
  expect(handleSubmit).toHaveBeenCalledWith({
    username,
    password,
  })
  expect(handleSubmit).toHaveBeenCalledTimes(1)
})

/*
eslint
  no-unused-vars: "off",
*/
