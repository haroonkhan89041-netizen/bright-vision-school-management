import type { Dispatch, SetStateAction } from "react";
declare global {
  namespace React {
    type Dispatch<A> = Dispatch<A>;
    type SetStateAction<S> = SetStateAction<S>;
  }
}
export {};
