import type { RawCommands } from '../types';
import { deleteSelection as originalDeleteSelection } from 'prosemirror-commands';

declare module 'rn-text-editor' {
  interface Commands<ReturnType> {
    deleteSelection: {
      /**
       * Delete the selection, if there is one.
       */
      deleteSelection: () => ReturnType;
    };
  }
}

export const deleteSelection: RawCommands['deleteSelection'] =
  () =>
  ({ state, dispatch }) => {
    return originalDeleteSelection(state, dispatch);
  };
