import * as editorCommands from '../commands';
import { Extension } from '../Extension';

// export * from '../commands';

export const EditorCommands = Extension.create({
  name: 'commands',

  addCommands() {
    return {
      ...editorCommands,
    };
  },
});
