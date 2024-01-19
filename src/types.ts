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
    [key: string]: any;
  }[];
  text?: string;
  [key: string]: any;
};

export type FocusPosition = 'start' | 'end' | 'all' | number | boolean | null;
