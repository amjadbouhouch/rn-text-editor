import {
  Node as ProseMirrorNode,
  type ParseOptions,
  Schema,
} from 'prosemirror-model';

import { createNodeFromContent } from './createNodeFromContent';
import type { Content } from '../core/types';

export function createDocument(
  content: Content,
  schema: Schema,
  parseOptions: ParseOptions = {}
): ProseMirrorNode {
  return createNodeFromContent(content, schema, {
    slice: false,
    parseOptions,
  }) as ProseMirrorNode;
}
