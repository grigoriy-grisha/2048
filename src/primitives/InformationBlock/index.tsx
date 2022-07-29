import { Accessor } from "solid-js";

import style from "../../style.module.css";

type InformationBlockProps = {
  value: Accessor<any>;
  valueClassName?: string;
};

function InformationBlock({ value, valueClassName }: InformationBlockProps) {
  return (
    <div class={style.scoreContainer}>
      <div class={style.scoreTitle}>Record</div>
      <div class={valueClassName}>{value()}</div>
    </div>
  );
}

export default InformationBlock;
