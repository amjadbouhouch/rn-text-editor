import type { EditorState, Transaction } from 'prosemirror-state';
import type { Editor } from './core';
import type { Commands } from 'rn-text-editor';

export type TextContentType = 'text' | 'paragraph';
type TextContentMark = {
  type?: 'italic' | 'bold' | 'link' | 'strike' | 'textStyle' | 'highlight';
  text?: string;
  attrs?: {
    href: string;
    color: string;
    label: string;
  };
};
type User = {
  id: string;
  displayName: string;
};

export type TextContent = {
  type: TextContentType;
  id: string;
  text?: string;
  marks?: TextContentMark[];
  content?: TextContent[];
  attrs?: {
    level: number;
    user?: User;
    start?: number;
    label?: string;
  };
  num?: number;
};

export type JSONContent = {
  type: TextContentType;
  attrs?: Record<string, any>;
  content?: JSONContent[];
  marks?: {
    type: string;
    attrs?: Record<string, any>;
    user?: User;
    [key: string]: any;
  }[];
  text?: string;
  [key: string]: any;
};
export type Content = JSONContent | Array<JSONContent>;
export type FocusPosition = 'start' | 'end' | 'all' | number | boolean | null;
export type Range = {
  from: number;
  to: number;
};

export interface EditorEvents {
  beforeCreate: { editor: Editor };
  create: { editor: Editor };
  update: { editor: Editor; transaction: Transaction };
  selectionUpdate: { editor: Editor; transaction: Transaction };
  transaction: { editor: Editor; transaction: Transaction };
  focus: { editor: Editor; event: FocusEvent; transaction: Transaction };
  blur: { editor: Editor; event: FocusEvent; transaction: Transaction };
  destroy: void;
}
export type Diff<T extends keyof any, U extends keyof any> = ({
  [P in T]: P;
} & {
  [P in U]: never;
} & { [x: string]: never })[T];

export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

export type ValuesOf<T> = T[keyof T];

//
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Command = (props: CommandProps) => boolean;

export type CommandSpec = (...args: any[]) => Command;
export type AnyCommands = Record<string, (...args: any[]) => Command>;
export type KeysWithTypeOf<T, Type> = {
  [P in keyof T]: T[P] extends Type ? P : never;
}[keyof T];

export type UnionCommands<T = Command> = UnionToIntersection<
  ValuesOf<Pick<Commands<T>, KeysWithTypeOf<Commands<T>, {}>>>
>;

export type RawCommands = {
  [Item in keyof UnionCommands]: UnionCommands<Command>[Item];
};

export type SingleCommands = {
  [Item in keyof UnionCommands]: UnionCommands<boolean>[Item];
};

export type ChainedCommands = {
  [Item in keyof UnionCommands]: UnionCommands<ChainedCommands>[Item];
} & {
  run: () => boolean;
};

export type CanCommands = SingleCommands & { chain: () => ChainedCommands };

export type CommandProps = {
  editor: Editor;
  tr: Transaction;
  commands: SingleCommands;
  can: () => CanCommands;
  chain: () => ChainedCommands;
  state: EditorState;
  // view: EditorView;
  dispatch: ((args?: any) => any) | undefined;
};
