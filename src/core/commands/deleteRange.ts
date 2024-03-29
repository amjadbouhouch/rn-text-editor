import type { Range, RawCommands } from '../types';

declare module 'rn-text-editor' {
  interface Commands<ReturnType> {
    deleteRange: {
      /**
       * Delete a given range.
       */
      deleteRange: (range: Range) => ReturnType;
    };
  }
}

export const deleteRange: RawCommands['deleteRange'] =
  (range) =>
  ({ tr, dispatch }) => {
    const { from, to } = range;

    if (dispatch) {
      tr.delete(from, to);
    }

    return true;
  };
