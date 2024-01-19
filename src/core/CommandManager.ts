import type { EditorState } from 'prosemirror-state';
import type { Editor } from './Editor';

export class CommandManager {
  editor: Editor;

  customState?: EditorState;

  constructor(props: { editor: Editor; state?: EditorState }) {
    this.editor = props.editor;
    // this.rawCommands = this.editor.extensionManager.commands
    // this.customState = props.state
  }

  get hasCustomState(): boolean {
    return !!this.customState;
  }

  get state(): EditorState {
    return this.customState || this.editor.state;
  }
}
