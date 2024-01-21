import type { MarkType } from 'prosemirror-model';
import { InputRule, type InputRuleFinder } from '../InputRule';
import type { ExtendedRegExpMatchArray } from '../types';
import { commonHelper, editorHelper } from '../../utils';

/**
 * Build an input rule that adds a mark when the
 * matched text is typed into it.
 */
export function markInputRule(config: {
  find: InputRuleFinder;
  type: MarkType;
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any>)
    | false
    | null;
}) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match }) => {
      const attributes = commonHelper.callOrReturn(
        config.getAttributes,
        undefined,
        match
      );

      if (attributes === false || attributes === null) {
        return null;
      }

      const { tr } = state;
      const captureGroup = match[match.length - 1];
      const fullMatch = match[0];

      if (captureGroup) {
        const startSpaces = fullMatch.search(/\S/);
        const textStart = range.from + fullMatch.indexOf(captureGroup);
        const textEnd = textStart + captureGroup.length;

        const excludedMarks = editorHelper
          .getMarksBetween(range.from, range.to, state.doc)
          .filter((item) => {
            // @ts-ignore
            const excluded = item.mark.type.excluded as MarkType[];

            return excluded.find(
              (type) => type === config.type && type !== item.mark.type
            );
          })
          .filter((item) => item.to > textStart);

        if (excludedMarks.length) {
          return null;
        }

        if (textEnd < range.to) {
          tr.delete(textEnd, range.to);
        }

        if (textStart > range.from) {
          tr.delete(range.from + startSpaces, textStart);
        }

        const markEnd = range.from + startSpaces + captureGroup.length;

        tr.addMark(
          range.from + startSpaces,
          markEnd,
          config.type.create(attributes || {})
        );

        tr.removeStoredMark(config.type);
      }
    },
  });
}
