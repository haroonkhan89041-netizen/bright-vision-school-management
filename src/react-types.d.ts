declare global {
  namespace React {
    type Dispatch<A> = import("react").Dispatch<A>;
    type SetStateAction<S> = import("react").SetStateAction<S>;
  }
}
export {};
