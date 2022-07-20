import type { Component } from "solid-js";
import { render } from "solid-js/web";
import { createEvent, createStore } from "effector";
import { useUnit } from "effector-solid";
import {
  $fieldsModel,
  $score,
  $swipes,
  createRandomFields,
  fields,
  moveBottomEvent,
  moveLeftEvent,
  moveRightEvent,
  moveTopEvent,
  setPrevFields,
} from "./model/fieldsModel";
import style from "./style.module.css";
import "./normalize.css";
import { For } from "solid-js";

const inputText = createEvent<string>();

const $text = createStore("");
const $size = createStore(0);

$text.on(inputText, (_, text) => text);
$size.on(inputText, (_, text) => text.length);

const Form = () => {
  const { fieldsModel, score, swipes } = useUnit({ fieldsModel: $fieldsModel, score: $score, swipes: $swipes });

  document.addEventListener(
    "keyup",
    (event) => {
      setPrevFields(fieldsModel());

      if (event.code === "ArrowDown") {
        moveBottomEvent();
      }
      if (event.code === "ArrowUp") {
        moveTopEvent();
      }
      if (event.code === "ArrowRight") {
        moveRightEvent();
      }
      if (event.code === "ArrowLeft") {
        moveLeftEvent();
      }

      setTimeout(createRandomFields, 100);
    },
    false,
  );

  return (
    <div class={style.container}>
      <div class={style.progressContainer}>
        <div class={style.scoreContainer}>
          <div class={style.scoreTitle}>Score</div>
          <div class={style.scoreValue}>{score()}</div>
        </div>
        <div class={style.scoreContainer}>
          <div class={style.scoreTitle}>Swipes</div>
          <div class={style.scoreValue}>{swipes()}</div>
        </div>
      </div>

      <div class={style.gameContainer}>
        <For each={fields}>
          {(item, i) => (
            <div class={style.fieldRow}>
              <For each={item}>
                {(item, ii) => {
                  return (
                    <div
                      class={
                        style.fieldItem +
                        " " +
                        (fieldsModel()[i()][ii()].value
                          ? style.filledFieldItem + " " + style["fieldItem" + fieldsModel()[i()][ii()].value]
                          : "")
                      }
                      style={{ left: `${25 * ii()}%`, top: `${25 * i()}%` }}
                    />
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

const App: Component = () => {
  return <Form />;
};

render(() => <App />, document.getElementById("root")!);
