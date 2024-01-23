import React from 'react';

import type { JSONContent, TextContentType } from '../core/types';
import { generateId } from '../utils/commonHelper';
import ParagraphNode from './ParagraphNode';
import TextNode from './TextNode';

const renderRules: Record<
  TextContentType | string,
  (
    node: JSONContent,
    index: number,
    children: React.ReactNode
  ) => React.ReactNode
> = {
  text: (node: JSONContent, index: number, children: React.ReactNode) => {
    const key = node.attrs?.id || generateId();
    return <TextNode key={key} index={index} children={children} {...node} />;
  },
  paragraph: (node: JSONContent, index: number, children: React.ReactNode) => {
    const key = node.attrs?.id || generateId();
    return (
      <ParagraphNode key={key} index={index} children={children} {...node} />
    );
  },
};
export default renderRules;
