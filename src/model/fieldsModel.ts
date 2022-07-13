import { createEvent, createStore } from "effector";

type Field = { value: null | number };
type Fields = Array<Field>;
type FieldsModelStore = Array<Array<Field>>;

export const fieldsModel = createStore<FieldsModelStore>([
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
]);

// РЕФАКТОРИНГ!!!!!!!

export const createRandomFields = createEvent();
export const moveBottomEvent = createEvent();
export const moveTopEvent = createEvent();
export const moveLeftEvent = createEvent();
export const moveRightEvent = createEvent();

const test = [
  [{ value: null }, { value: 2 }, { value: null }, { value: null }],
  [{ value: null }, { value: 2 }, { value: null }, { value: null }],
  [{ value: null }, { value: null }, { value: null }, { value: null }],
  [{ value: null }, { value: 8 }, { value: null }, { value: null }],
];

function changeOrientation(state: FieldsModelStore) {
  const result: any[] = [];

  state.forEach((item, index) => {
    item.forEach((item, index) => {
      if (!result[index]) {
        result[index] = [];
      }

      result[index].push(item);
    });
  });

  return result;
}

function moveRight(state: FieldsModelStore) {
  for (let i = 0; i < state.length; i++) {
    const item = state[i];

    const nulled = item.filter(fieldIsNotEmpty);
    const notNulled = item.filter(fieldIsEmpty);

    state[i] = [...nulled, ...notNulled];

    for (let j = 0; j < item.length; j++) {
      let prev: any = null;

      if (item[j].value) {
        for (let k = j; k < item.length; k++) {
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
  }
}

function moveLeft(state: FieldsModelStore) {
  for (let i = 0; i < state.length; i++) {
    const item = state[i];

    const nulled = item.filter(fieldIsNotEmpty);
    const notNulled = item.filter(fieldIsEmpty);

    state[i] = [...notNulled, ...nulled];

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

    state[i] = [...notNulled2, ...nulled2];
  }
}

function moveTop(state: FieldsModelStore) {
  const copyState = changeOrientation(state);
  moveLeft(copyState);
  return changeOrientation(copyState);
}

function moveBot(state: FieldsModelStore) {
  const copyState = changeOrientation(state);
  moveRight(copyState);
  return changeOrientation(copyState);
}

// moveLeft(test);
console.log(moveBot(test));

fieldsModel.on(moveRightEvent, (state) => {
  console.log(state);
});

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

function generateRandomMinimalFields(state: FieldsModelStore) {
  const copyState = [...state];
  setMinimalValuesToFields(getRandomFields(getNullableFields(copyState), 2));
  return copyState;
}

fieldsModel.on(createRandomFields, generateRandomMinimalFields);

createRandomFields();
