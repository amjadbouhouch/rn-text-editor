import type { RawCommands } from '../types';
import { deleteSelection as originalDeleteSelection } from 'prosemirror-commands';
import { TextSelection } from 'prosemirror-state';
import { minMax } from '../../utils/commonHelper';

declare module 'rn-text-editor' {
  interface Commands<ReturnType> {
    deleteBeforeCursor: {
      /**
       * Delete the character before the cursor.
       */
      deleteBeforeCursor: () => ReturnType;
    };
  }
}

export const deleteBeforeCursor: RawCommands['deleteBeforeCursor'] =
  () =>
  ({ state, dispatch }) => {
    const tr = state.tr;
    // delete one character
    if (state.selection.empty) {
      const pos = state.selection.$from.pos - 1;
      const minPos = TextSelection.atStart(tr.doc).from;
      const maxPos = TextSelection.atEnd(tr.doc).to;
      const resolvedPos = minMax(pos, minPos, maxPos);
      tr.delete(resolvedPos, pos + 1);
      if (dispatch) {
        dispatch(tr);
      }
    }

    return false;
  };
