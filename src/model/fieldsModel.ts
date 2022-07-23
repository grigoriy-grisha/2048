import { createEffect, createEvent, createStore, guard, sample } from "effector";
import { clone, equals } from "ramda";
import { wait } from "../urils/wait";

type Field = { value: null | number };
type Fields = Array<Field>;
export type FieldsModelStore = Array<Array<Field>>;

export const fields = [
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
];

export enum GameState {
  START,
  IN_GAME,
  WON,
  FAIL,
}

export const fetchRecordFx = createEffect(async () => {
  await wait(2500);
  return Number(localStorage.getItem("record"));
});

export const sendRecordFx = createEffect(async (record: number) => {
  await wait(1500);
  return Number(localStorage.setItem("record", String(record)));
});

export const $fieldsModel = createStore<FieldsModelStore>(fields);
export const $prevFieldsModel = createStore<FieldsModelStore>(fields);
export const $score = createStore<number>(0);
export const $gameState = createStore<GameState>(GameState.START);
export const $record = createStore<number>(0);

const rotate = (matrix: any) => {
  return matrix.map((row: any, i: any) => row.map((val: any, j: any) => matrix[matrix.length - 1 - j][i]));
};

// РЕФАКТОРИНГ!!!!!!!

export const createRandomFields = createEvent<number>();
export const moveBottomEvent = createEvent();
export const moveTopEvent = createEvent();
export const moveLeftEvent = createEvent();
export const moveRightEvent = createEvent();
export const setPrevFields = createEvent<FieldsModelStore>();
export const startClicked = createEvent<any>();
export const toMainMenuClicked = createEvent<any>();
export const wonState = createEvent();
export const failState = createEvent();
export const setRecord = createEvent<number>();

$gameState
  .on(startClicked, () => GameState.IN_GAME)
  .on(toMainMenuClicked, () => GameState.START)
  .on(wonState, () => GameState.WON)
  .on(failState, () => GameState.FAIL);

$prevFieldsModel.on(setPrevFields, (_, fields) => fields).reset(toMainMenuClicked);

$record.on(fetchRecordFx.doneData, (_, record) => record).on(setRecord, (_, record) => record);

const moving = [moveBottomEvent, moveTopEvent, moveLeftEvent, moveRightEvent];

const fieldsMoved = guard({
  clock: moving,
  source: [$fieldsModel, $prevFieldsModel],
  filter: ([fieldsModel, prevFieldsModel]) => !equals(fieldsModel, prevFieldsModel),
});

sample({
  clock: fieldsMoved,
  fn: () => 1,
  target: createRandomFields,
});

const computeScore = (fieldsModel: FieldsModelStore) => {
  const computeRowScore = (row: Field[]) => row.reduce((acc, field) => acc + Number(field.value), 0);

  return fieldsModel.reduce((acc, row) => acc + computeRowScore(row), 0);
};

sample({
  clock: fieldsMoved,
  source: $fieldsModel,
  fn: computeScore,
  target: $score,
});

const gameOver = guard({
  clock: createRandomFields,
  source: $fieldsModel,
  filter: isGameOver,
});

sample({
  clock: gameOver,
  target: failState,
});

const win = guard({
  clock: createRandomFields,
  source: $fieldsModel,
  filter: isWin,
});

sample({
  clock: win,
  target: wonState,
});

sample({
  clock: [gameOver, win],
  source: [$score, $record],
  fn: ([score, record]) => (score > record ? score : record),
  target: [sendRecordFx, setRecord],
});

export function isGameOver(state: FieldsModelStore) {
  const minIndex = 0;
  const maxColumnIndex = state.length - 1;
  const maxRowIndex = state[0].length - 1;

  for (let i = 0; i <= maxColumnIndex; i++) {
    for (let k = 0; k <= maxRowIndex; k++) {
      const itemValue = state[i][k].value;

      if (itemValue === null) return false;

      const [leftIndex, topIndex, rightIndex, bottomIndex] = [k - 1, i - 1, k + 1, i + 1];

      if (leftIndex >= minIndex) {
        if (itemValue === state[i][leftIndex].value) return false;
      }
      if (topIndex >= minIndex) {
        if (itemValue === state[topIndex][k].value) return false;
      }
      if (rightIndex <= maxColumnIndex) {
        if (itemValue === state[i][rightIndex].value) return false;
      }
      if (bottomIndex <= maxRowIndex) {
        if (itemValue === state[bottomIndex][k].value) return false;
      }
    }
  }

  return true;
}

function isWin(state: FieldsModelStore) {
  return !!state.find((row) => row.find((field) => field.value === 2048));
}

export function moveRight(state: FieldsModelStore) {
  const copyState = clone(state);

  for (let i = 0; i < copyState.length; i++) {
    const item = copyState[i];

    const nulled = item.filter(fieldIsNotEmpty);
    const notNulled = item.filter(fieldIsEmpty);

    copyState[i] = [...nulled, ...notNulled];

    for (let j = copyState[i].length - 1; j >= 0; j--) {
      let prev: any = null;

      if (copyState[i][j].value) {
        for (let k = j; k >= 0; k--) {
          if (prev === null) {
            prev = copyState[i][k];
            continue;
          }

          if (copyState[i][k].value) {
            if (prev.value === copyState[i][k].value) {
              copyState[i][k].value = copyState[i][k].value! * 2;
              prev.value = null;
            }
          }

          prev = copyState[i][k];
        }
      }
    }

    const nulled2 = item.filter(fieldIsNotEmpty);
    const notNulled2 = item.filter(fieldIsEmpty);

    copyState[i] = [...nulled2, ...notNulled2];
  }

  return copyState;
}

function moveLeft(state: FieldsModelStore) {
  return rotate(rotate(moveRight(rotate(rotate(state)))));
}

function moveTop(state: FieldsModelStore) {
  return rotate(rotate(rotate(moveRight(rotate(state)))));
}

function moveBot(state: FieldsModelStore) {
  return rotate(moveRight(rotate(rotate(rotate(state)))));
}

$fieldsModel
  .on(moveRightEvent, moveRight)
  .on(moveLeftEvent, moveLeft)
  .on(moveBottomEvent, moveBot)
  .on(moveTopEvent, moveTop)
  .reset(toMainMenuClicked);

function fieldIsNotEmpty(field: Field) {
  return !field.value;
}

function fieldIsEmpty(field: Field) {
  return !!field.value;
}

function getRandomIndex(state: Fields) {
  return Math.floor(Math.random() * state.length);
}

function getRandomFields(state: Fields, count: number) {
  const fields = [];
  const copyState = [...state];

  for (let i = 0; i < count; i++) {
    const randomIndex = getRandomIndex(copyState);
    fields.push(copyState[randomIndex]);
    copyState.splice(randomIndex, 1);
  }

  return fields;
}

const randomBool = () => Math.random() > 0.5;
const getRandomMinimalValue = () => (randomBool() ? 2 : 4);
const setMinimalValueToField = (field: Field) => (field.value = getRandomMinimalValue());
const setMinimalValuesToFields = (state: Fields) => state.forEach(setMinimalValueToField);
const getNullableFields = (state: FieldsModelStore) => state.flat(1).filter(fieldIsNotEmpty);

function generateRandomMinimalFields(state: FieldsModelStore, payload: number) {
  const copyState = [...state];
  setMinimalValuesToFields(getRandomFields(getNullableFields(copyState), payload));
  return copyState;
}

$fieldsModel.on(createRandomFields, generateRandomMinimalFields);

createRandomFields(2);
fetchRecordFx();
