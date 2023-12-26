import { SyntheticEvent } from "react";

export const stopPropagationCurry = (cb: Function) => (e: SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
  cb();
};
