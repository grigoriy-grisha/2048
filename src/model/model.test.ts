import { moveRight } from "./fieldsModel";

// тестировать передвижения имеет смысл только для moveRight,
// так как все остальные функции просто вращают матрицу и двигают ее вправо,
// а потом вращают ее в обратном направлении :D

describe("move fields", () => {
  it("move right one fields", () => {
    const fields = [
      [{ value: 2 }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
    ];

    const newFields = moveRight(fields);

    expect(newFields).toStrictEqual([
      [{ value: null }, { value: null }, { value: null }, { value: 2 }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
    ]);
  });

  it("move right two fields should stacked", () => {
    const fields = [
      [{ value: 2 }, { value: 4 }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
    ];

    const newFields = moveRight(fields);

    expect(newFields).toStrictEqual([
      [{ value: null }, { value: null }, { value: 2 }, { value: 4 }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
    ]);
  });

  it("move right two fields should merged", () => {
    const fields = [
      [{ value: 2 }, { value: null }, { value: null }, { value: 2 }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
    ];

    const newFields = moveRight(fields);

    expect(newFields).toStrictEqual([
      [{ value: null }, { value: null }, { value: null }, { value: 4 }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
      [{ value: null }, { value: null }, { value: null }, { value: null }],
    ]);
  });
});
