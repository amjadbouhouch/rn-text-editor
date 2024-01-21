import type { RawCommands } from '../types';

declare module 'rn-text-editor' {
  interface Commands<ReturnType> {
    selectAll: {
      /**
       * Select the whole document.
       */
      selectAll: () => ReturnType;
    };
  }
}

export const selectAll: RawCommands['selectAll'] =
  () =>
  ({ tr, commands }) => {
    return commands.setTextSelection({
      from: 0,
      to: tr.doc.content.size,
    });
  };
