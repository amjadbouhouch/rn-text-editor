import type { ParseOptions } from 'prosemirror-model';
import type { Content, RawCommands } from '../types';

declare module 'rn-text-editor' {
  interface Commands<ReturnType> {
    insertContent: {
      /**
       * Insert a node or string of HTML at the current position.
       */
      insertContent: (
        value: Content,
        options?: {
          parseOptions?: ParseOptions;
          updateSelection?: boolean;
        }
      ) => ReturnType;
    };
  }
}

export const insertContent: RawCommands['insertContent'] =
  (value, options) =>
  ({ tr, commands }) => {
    return commands.insertContentAt(
      { from: tr.selection.from, to: tr.selection.to },
      value,
      options
    );
  };
