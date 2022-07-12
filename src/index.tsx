import type { Component } from 'solid-js';
import { render } from 'solid-js/web'
import { createEvent, createStore } from "effector";
import { useUnit } from 'effector-solid'

const inputText = createEvent<string>()

const $text = createStore('')
const $size = createStore(0)

$text.on(inputText, (_, text) => text)
$size.on(inputText, (_, text) => text.length)

const Form = () => {
  const { text, size, inputTextEvent } = useUnit({
    size: $size,
    text: $text,
    inputTextEvent: inputText
  })

  return (
    <form>
      <input
        type="text"
        onInput={e => inputTextEvent(e.currentTarget.value)}
        value={text()}
      />
      <p>Length: {size}</p>
    </form>
  )
}

const App: Component = () => {
  return (
    <Form />
  );
};

render(() => <App />, document.getElementById('root')!)
