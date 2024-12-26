export {};

declare module "vue" {
  interface ComponentCustomProperties {
    // $isNull: any;
  }
}

declare let window: {
  Callback: Function;
};
