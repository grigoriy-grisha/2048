import type { Component } from "solid-js";
import { render } from "solid-js/web";
import { createEvent, createStore } from "effector";
import { useUnit } from "effector-solid";
import {
  $fieldsModel,
  $gameState,
  $record,
  $score,
  fetchRecordFx,
  fields,
  GameState,
  moveBottomEvent,
  moveLeftEvent,
  moveRightEvent,
  moveTopEvent,
  sendRecordFx,
  setPrevFields,
  startClicked,
  toMainMenuClicked,
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
  const { fieldsModel, score, gameState, record, loadData, sendRecordLoading } = useUnit({
    fieldsModel: $fieldsModel,
    score: $score,
    gameState: $gameState,
    record: $record,
    loadData: fetchRecordFx.pending,
    sendRecordLoading: sendRecordFx.pending,
  });

  document.addEventListener(
    "keyup",
    (event) => {
      if (gameState() !== GameState.IN_GAME) return;

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
    },
    false,
  );

  return (
    <>
      {loadData() && (
        <div class={style.actionContainer + " " + style.startContainer}>
          <div class={style.actionText}>LOADING</div>
          <div class={style.innerBlock}>
            <div class={style.loadingBlock} />
          </div>
        </div>
      )}
      {!loadData() && gameState() === GameState.START && (
        <div class={style.actionContainer + " " + style.startContainer}>
          <div class={style.actionText}>START</div>
          <button class={style.start} onClick={startClicked}>
            <div class={style.startContent} />
          </button>
        </div>
      )}
      {(gameState() === GameState.IN_GAME || gameState() === GameState.FAIL || gameState() === GameState.WON) && (
        <div class={style.container}>
          <div class={style.progressContainer}>
            <div class={style.scoreContainer}>
              <div class={style.scoreTitle}>Record</div>
              <div class={style.recordValue}>{record()}</div>
            </div>
            <div class={style.scoreContainer}>
              <div class={style.scoreTitle}>Score</div>
              <div class={style.scoreValue}>{score()}</div>
            </div>
          </div>
          {gameState() === GameState.FAIL && (
            <div class={style.actionContainer}>
              <div class={style.actionText}>FAIL</div>
              {sendRecordLoading() ? (
                <div class={style.innerBlock}>
                  <div class={style.loadingBlock} />
                </div>
              ) : (
                <button class={style.start} onClick={toMainMenuClicked}>
                  <div class={style.startContent} />
                </button>
              )}
            </div>
          )}
          {gameState() === GameState.WON && (
            <div class={style.actionContainer}>
              <div class={style.actionText}>WON</div>
              {sendRecordLoading() ? (
                <div class={style.innerBlock}>
                  <div class={style.loadingBlock} />
                </div>
              ) : (
                <button class={style.start} onClick={toMainMenuClicked}>
                  <div class={style.startContent} />
                </button>
              )}
            </div>
          )}
          {gameState() === GameState.IN_GAME && (
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
          )}
        </div>
      )}
    </>
  );
};

const App: Component = () => {
  return <Form />;
};

render(() => <App />, document.getElementById("root")!);
