import React from 'react';

import TextNode from './TextNode';
import type { JSONContent, TextContentType } from '../types';
import ParagraphNode from './ParagraphNode';

const renderRules: Record<
  TextContentType,
  (
    node: JSONContent,
    index: number,
    children: React.ReactNode
  ) => React.ReactNode
> = {
  text: (node: JSONContent, index: number, children: React.ReactNode) => {
    return (
      <TextNode key={node.id} index={index} children={children} {...node} />
    );
  },
  paragraph: (node: JSONContent, index: number, children: React.ReactNode) => {
    return (
      <ParagraphNode
        key={node.id}
        index={index}
        children={children}
        {...node}
      />
    );
  },
};
export default renderRules;
