import { createEvent, createStore, guard, sample } from "effector";
import { clone, equals } from "ramda";

type Field = { value: null | number };
type Fields = Array<Field>;
export type FieldsModelStore = Array<Array<Field>>;

export const fields = [
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
];

export const $fieldsModel = createStore<FieldsModelStore>(fields);
export const $prevFieldsModel = createStore<FieldsModelStore>(fields);
export const $score = createStore<number>(0);
export const $swipes = createStore<number>(0);

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
export const registerSwipe = createEvent();

$swipes.on(registerSwipe, (swipes) => ++swipes);

$prevFieldsModel.on(setPrevFields, (_, fields) => fields);

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

sample({
  clock: fieldsMoved,
  target: registerSwipe,
});

sample({
  clock: moving,
  source: $fieldsModel,
  fn: (fieldsModel) =>
    fieldsModel.reduce((acc, row) => acc + row.reduce((acc, field) => acc + Number(field.value), 0), 0),
  target: $score,
});

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

$fieldsModel.on(moveRightEvent, moveRight);
$fieldsModel.on(moveLeftEvent, moveLeft);
$fieldsModel.on(moveBottomEvent, moveBot);
$fieldsModel.on(moveTopEvent, moveTop);

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
