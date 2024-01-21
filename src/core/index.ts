export * from './CommandManager';
export * from './Editor';
export * as extensions from './Extensions';

export interface Commands<ReturnType = any> {}
export interface ExtensionConfig<Options = any, Storage = any> {}
export interface NodeConfig<Options = any, Storage = any> {}
export interface MarkConfig<Options = any, Storage = any> {}
