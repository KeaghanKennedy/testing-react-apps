// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, screen, act, renderHook} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

// 🐨 create a simple function component that uses the useCounter hook
// and then exposes some UI that our test can interact with to test the
// capabilities of this hook
// 💰 here's how to use the hook:
// const {count, increment, decrement} = useCounter()
// function CounterTest() {
//   const {count, increment, decrement} = useCounter()

//   return (
//     <div>
//       <div>Test count: {count}</div>
//       <button onClick={increment}>increment</button>
//       <button onClick={decrement}>decrement</button>
//     </div>
//   )
// }

function setup(props) {
  const results = {}
  function TestComponent() {
    Object.assign(results, useCounter(props))
    return null
  }
  render(<TestComponent />)
  return results
}

test('exposes the count and increment/decrement functions', async () => {
  // 🐨 render the component
  // 🐨 get the elements you need using screen
  // 🐨 assert on the initial state of the hook
  // 🐨 interact with the UI using userEvent and assert on the changes in the UI
  // render(<CounterTest />)

  // const countText = screen.getByText(/test count/i)
  // expect(countText).toHaveTextContent('Test count: 0')
  // await userEvent.click(screen.getByRole('button', {name: /increment/i}))
  // expect(countText).toHaveTextContent('Test count: 1')
  // await userEvent.click(screen.getByRole('button', {name: /decrement/i}))
  // expect(countText).toHaveTextContent('Test count: 0')

  const result = setup()

  expect(result.count).toBe(0)
  await act(() => result.increment())
  expect(result.count).toBe(1)
  await act(() => result.decrement())
  expect(result.count).toBe(0)
})

test('allows customization of the initial count', () => {
  const result = setup({initialCount: 2})
  expect(result.count).toBe(2)
})

test('allows customization of the step', async () => {
  const {result} = renderHook(() => useCounter({step: 2}))
  expect(result.current.count).toBe(0)
  await act(() => result.current.increment())
  expect(result.current.count).toBe(2)
})
