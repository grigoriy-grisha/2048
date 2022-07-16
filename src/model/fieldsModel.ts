import { createEvent, createStore, guard, sample } from "effector";
import { equals } from "ramda";

type Field = { value: null | number };
type Fields = Array<Field>;
type FieldsModelStore = Array<Array<Field>>;

export const $fieldsModel = createStore<FieldsModelStore>([
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
]);

const rotate = (matrix: any) => {
  return matrix.map((row: any, i: any) => row.map((val: any, j: any) => matrix[matrix.length - 1 - j][i]));
};

// РЕФАКТОРИНГ!!!!!!!

export const createRandomFields = createEvent<number>();
export const moveBottomEvent = createEvent();
export const moveTopEvent = createEvent();
export const moveLeftEvent = createEvent();
export const moveRightEvent = createEvent();

sample({
  clock: [moveBottomEvent, moveTopEvent, moveLeftEvent, moveRightEvent],
  fn: () => 1,
  target: createRandomFields,
});

function moveRight(state: FieldsModelStore) {
  const copyState = [...state];

  for (let i = 0; i < copyState.length; i++) {
    const item = copyState[i];

    const nulled = item.filter(fieldIsNotEmpty);
    const notNulled = item.filter(fieldIsEmpty);

    copyState[i] = [...nulled, ...notNulled];

    for (let j = item.length - 1; j >= 0; j--) {
      let prev: any = null;

      if (item[j].value) {
        for (let k = j; k >= 0; k--) {
          if (prev === null) {
            prev = item[k];
            continue;
          }

          if (item[k].value) {
            if (prev.value === item[k].value) {
              item[k].value = item[k].value! * 2;
              prev.value = null;
            }
          }

          prev = item[k];
        }
      }
    }

    const nulled2 = item.filter(fieldIsNotEmpty);
    const notNulled2 = item.filter(fieldIsEmpty);

    copyState[i] = [...nulled2, ...notNulled2];
  }

  return equals(copyState, state) ? state : copyState;
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
