import { Accessor, JSX } from "solid-js";

import style from "../../style.module.css";

type ActionButtonProps = {
  loadingText?: string;
  loading?: Accessor<boolean>;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  actionText: string;
  outerClassName?: string;
};

function ActionButton({ onClick, actionText, loadingText, loading, outerClassName }: ActionButtonProps) {
  return (
    <>
      {loading && loading() && (
        <div class={style.actionContainer + " " + outerClassName}>
          <div class={style.actionText}>{loadingText}</div>
          <div class={style.innerBlock}>
            <div class={style.loadingBlock} />
          </div>
        </div>
      )}
      {(!loading || !loading()) && (
        <div class={style.actionContainer + " " + outerClassName}>
          <div class={style.actionText}>{actionText}</div>
          <button class={style.start} onClick={onClick}>
            <div class={style.startContent} />
          </button>
        </div>
      )}
    </>
  );
}

export default ActionButton;
