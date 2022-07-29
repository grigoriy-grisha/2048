import style from "../../style.module.css";
import { Accessor } from "solid-js";

type FieldItemProps = {
  value: Accessor<number | null>;
  xPosition: Accessor<number>;
  yPosition: Accessor<number>;
};

function FieldItem({ value, xPosition, yPosition }: FieldItemProps) {
  return (
    <div
      class={style.fieldItem + " " + (value() ? style.filledFieldItem + " " + style["fieldItem" + value()] : "")}
      style={{ left: `${25 * xPosition()}%`, top: `${25 * yPosition()}%` }}
    />
  );
}

export default FieldItem;
