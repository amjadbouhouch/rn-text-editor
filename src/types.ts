import type { Transaction } from 'prosemirror-state';
import type { Editor } from './core';

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
  id: string;
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
