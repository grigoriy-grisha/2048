import { createMemo } from "solid-js";
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
  moveBottomEvent,
  moveLeftEvent,
  moveRightEvent,
  moveTopEvent,
  sendRecordFx,
  setPrevFields,
  startClicked,
  GameState,
} from "./model/fieldsModel";
import style from "./style.module.css";
import "./normalize.css";
import ActionButton from "./primitives/ActionButton";
import InformationBlock from "./primitives/InformationBlock";
import PlayingField from "./components/PlayingField";
import useArrowControl from "./hooks/useArrowControl";

const inputText = createEvent<string>();

const $text = createStore("");
const $size = createStore(0);

$text.on(inputText, (_, text) => text);
$size.on(inputText, (_, text) => text.length);

const App = () => {
  const { fieldsModel, score, gameState, record, loadData, sendRecordLoading } = useUnit({
    fieldsModel: $fieldsModel,
    score: $score,
    gameState: $gameState,
    record: $record,
    loadData: fetchRecordFx.pending,
    sendRecordLoading: sendRecordFx.pending,
  });

  useArrowControl({
    forbidControls: () => gameState() !== GameState.IN_GAME,
    beforeArrows: () => setPrevFields(fieldsModel()),
    onTop: moveTopEvent,
    onRight: moveRightEvent,
    onLeft: moveLeftEvent,
    onBottom: moveBottomEvent,
  });

  const inGameProcess = createMemo(
    () => gameState() === GameState.IN_GAME || gameState() === GameState.FAIL || gameState() === GameState.WON,
  );

  return (
    <>
      {gameState() === GameState.START && (
        <ActionButton
          outerClassName={style.startContainer}
          actionText="START"
          loading={loadData}
          loadingText="LOADING"
          onClick={startClicked}
        />
      )}
      {inGameProcess() && (
        <div class={style.container}>
          <div class={style.progressContainer}>
            <InformationBlock valueClassName={style.recordValue} value={record} />
            <InformationBlock valueClassName={style.scoreValue} value={score} />
          </div>
          {gameState() === GameState.FAIL && (
            <ActionButton actionText="FAIL" loading={sendRecordLoading} loadingText="FAIL" onClick={startClicked} />
          )}
          {gameState() === GameState.WON && (
            <ActionButton actionText="WON" loading={sendRecordLoading} loadingText="WON" onClick={startClicked} />
          )}
          {gameState() === GameState.IN_GAME && <PlayingField staticFields={fields} fields={fieldsModel} />}
        </div>
      )}
    </>
  );
};

render(() => <App />, document.getElementById("root")!);
