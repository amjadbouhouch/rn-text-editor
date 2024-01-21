import { TextSelection } from 'prosemirror-state';
import type { Range, RawCommands } from '../types';
import { minMax } from '../../utils/commonHelper';

declare module 'rn-text-editor' {
  interface Commands<ReturnType> {
    setTextSelection: {
      /**
       * Creates a TextSelection.
       */
      setTextSelection: (position: number | Range) => ReturnType;
    };
  }
}

export const setTextSelection: RawCommands['setTextSelection'] =
  (position) =>
  ({ tr, dispatch }) => {
    if (dispatch) {
      const { doc } = tr;
      const { from, to } =
        typeof position === 'number'
          ? { from: position, to: position }
          : position;
      const minPos = TextSelection.atStart(doc).from;
      const maxPos = TextSelection.atEnd(doc).to;
      const resolvedFrom = minMax(from, minPos, maxPos);
      const resolvedEnd = minMax(to, minPos, maxPos);
      const selection = TextSelection.create(doc, resolvedFrom, resolvedEnd);

      tr.setSelection(selection);
    }

    return true;
  };
