import * as components from "./index.ts";

declare global {
  interface Window {
    WIC: typeof components;
  }
}

window.WIC = Object.assign(window.WIC ?? {}, components);
