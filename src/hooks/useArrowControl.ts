import { onCleanup, createEffect } from "solid-js";

type HookArrowControlParams = {
  forbidControls?: () => boolean;
  beforeArrows: () => void;
  onBottom: () => void;
  onTop: () => void;
  onLeft: () => void;
  onRight: () => void;
};

function useArrowControl({ beforeArrows, onBottom, onLeft, onRight, onTop, forbidControls }: HookArrowControlParams) {
  const arrowsControlHandler = (event: KeyboardEvent) => {
    if (forbidControls && forbidControls()) return;

    beforeArrows();

    if (event.code === "ArrowDown") onBottom();
    if (event.code === "ArrowUp") onTop();
    if (event.code === "ArrowRight") onRight();
    if (event.code === "ArrowLeft") onLeft();
  };

  createEffect(() => {
    document.addEventListener("keyup", arrowsControlHandler);
    onCleanup(() => document.removeEventListener("keyup", arrowsControlHandler));
  });
}

export default useArrowControl;
