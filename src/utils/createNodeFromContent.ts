import type {
  Node as ProseMirrorNode,
  ParseOptions,
  Schema,
} from 'prosemirror-model';
import { Fragment, DOMParser } from 'prosemirror-model';
import type { Content } from '../core/types.js';
import { elementFromString } from './elementFromString';

export type CreateNodeFromContentOptions = {
  slice?: boolean;
  parseOptions?: ParseOptions;
};
export function createNodeFromContent(
  content: Content,
  schema: Schema,
  options?: CreateNodeFromContentOptions
): ProseMirrorNode | Fragment {
  options = {
    slice: true,
    parseOptions: {},
    ...options,
  };

  if (typeof content === 'object' && content !== null) {
    try {
      if (Array.isArray(content) && content.length > 0) {
        return Fragment.fromArray(
          content.map((item) => schema.nodeFromJSON(item))
        );
      }

      return schema.nodeFromJSON(content);
    } catch (error) {
      console.warn(
        'Invalid content.',
        'Passed value:',
        content,
        'Error:',
        error
      );

      return createNodeFromContent('', schema, options);
    }
  }

  if (typeof content === 'string') {
    const parser = DOMParser.fromSchema(schema);

    return options.slice
      ? parser.parseSlice(elementFromString(content), options.parseOptions)
          .content
      : parser.parse(elementFromString(content), options.parseOptions);
  }

  return createNodeFromContent('', schema, options);
}
