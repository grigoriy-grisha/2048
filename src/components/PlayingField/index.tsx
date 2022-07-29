import style from "../../style.module.css";
import { Accessor, For } from "solid-js";
import { FieldsModelStore } from "../../model/fieldsModel";
import FieldItem from "../../primitives/FieldItem";

type PlayingFieldProps = {
  staticFields: FieldsModelStore;
  fields: Accessor<FieldsModelStore>;
};

function PlayingField({ fields, staticFields }: PlayingFieldProps) {
  return (
    <div class={style.gameContainer}>
      <For each={staticFields}>
        {(item, i) => (
          <div class={style.fieldRow}>
            <For each={item}>
              {(item, ii) => <FieldItem value={() => fields()[i()][ii()].value} xPosition={ii} yPosition={i} />}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}

export default PlayingField;
