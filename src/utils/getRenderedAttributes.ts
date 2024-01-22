import type { Mark, Node } from 'prosemirror-model';
import type { ExtensionAttribute } from '../core/types';
import { mergeAttributes } from './mergeAttributes';

export function getRenderedAttributes(
  nodeOrMark: Node | Mark,
  extensionAttributes: ExtensionAttribute[]
): Record<string, any> {
  return extensionAttributes
    .filter((item) => item.attribute.rendered)
    .map((item) => {
      if (!item.attribute.renderHTML) {
        return {
          [item.name]: nodeOrMark.attrs[item.name],
        };
      }
      // @ts-ignore
      return item.attribute.renderHTML(nodeOrMark.attrs) || {};
    })
    .reduce(
      (attributes, attribute) => mergeAttributes(attributes, attribute),
      {}
    );
}
