import React from 'react';

import TextNode from './TextNode';
import type { JSONContent, TextContentType } from '../types';
import ParagraphNode from './ParagraphNode';
import { commonHelper } from '../utils';

const renderRules: Record<
  TextContentType,
  (
    node: JSONContent,
    index: number,
    children: React.ReactNode
  ) => React.ReactNode
> = {
  text: (node: JSONContent, index: number, children: React.ReactNode) => {
    const key = node.attrs?.id || commonHelper.generateId();
    return <TextNode key={key} index={index} children={children} {...node} />;
  },
  paragraph: (node: JSONContent, index: number, children: React.ReactNode) => {
    const key = node.attrs?.id || commonHelper.generateId();
    return (
      <ParagraphNode key={key} index={index} children={children} {...node} />
    );
  },
};
export default renderRules;
