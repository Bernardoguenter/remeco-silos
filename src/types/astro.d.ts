declare module "*.astro" {
  import {
    AstroComponentFactory,
    AstroComponentInstance,
  } from "astro/dist/runtime/server";

  const Component: AstroComponentFactory<any, any>;
  export default Component;
}
