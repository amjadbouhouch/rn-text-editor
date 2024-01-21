export * from './clearNodes';
export * from './command';

declare module 'rn-text-editor' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Commands<ReturnType = any> {}
}
