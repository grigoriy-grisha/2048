import { isGameOver, moveRight } from "./fieldsModel";

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

describe("game over", () => {
  it("should return true", () => {
    const fields = [
      [{ value: 2 }, { value: 4 }, { value: 8 }, { value: 2 }],
      [{ value: 4 }, { value: 2 }, { value: 16 }, { value: 32 }],
      [{ value: 8 }, { value: 32 }, { value: 2 }, { value: 16 }],
      [{ value: 4 }, { value: 2 }, { value: 4 }, { value: 2 }],
    ];

    expect(isGameOver(fields)).toBe(true);
  });

  it("should return true 2", () => {
    const fields = [
      [{ value: null }, { value: 4 }, { value: 8 }, { value: 2 }],
      [{ value: 4 }, { value: 2 }, { value: 16 }, { value: 32 }],
      [{ value: 8 }, { value: 32 }, { value: 2 }, { value: 16 }],
      [{ value: 4 }, { value: 2 }, { value: 4 }, { value: 2 }],
    ];

    expect(isGameOver(fields)).toBe(false);
  });

  it("should return false", () => {
    const fields = [
      [{ value: 4 }, { value: 4 }, { value: 8 }, { value: 2 }],
      [{ value: 4 }, { value: 2 }, { value: 16 }, { value: 32 }],
      [{ value: 4 }, { value: 32 }, { value: 2 }, { value: 16 }],
      [{ value: 4 }, { value: 2 }, { value: 4 }, { value: 2 }],
    ];

    expect(isGameOver(fields)).toBe(false);
  });
});
