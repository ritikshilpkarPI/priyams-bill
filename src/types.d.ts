import { store } from "./redux/store";

declare global {
  export interface UserStateType {

  }

  export type RootState = ReturnType<typeof store.getState>;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

export {};
