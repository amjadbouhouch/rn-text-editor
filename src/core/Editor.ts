import { Fragment, Schema } from 'prosemirror-model';
import { marks, nodes } from 'prosemirror-schema-basic';
import { EditorState, TextSelection } from 'prosemirror-state';
import type { FocusPosition, JSONContent } from '../types';
import { CommandManager } from './CommandManager';
import { editorHelper } from '../utils';
export type EditorProps = {
  initialContent: JSONContent[];
  focusPosition?: FocusPosition;
};
export class Editor {
  private _schema: Schema;
  public commandManager: CommandManager;
  public state;
  constructor({
    initialContent = [],
    focusPosition = null,
  }: Partial<EditorProps>) {
    this._schema = new Schema({
      nodes: nodes,
      marks: marks,
    });

    const parsedContent = Fragment.fromArray(
      initialContent.map((item) => this._schema.nodeFromJSON(item))
    );
    const doc = this._schema.node('doc', null, parsedContent);

    const selection = editorHelper.resolveFocusPosition(doc, focusPosition);
    this.state = EditorState.create({
      schema: this._schema,
      doc: doc,
      selection: selection ?? undefined,
    });
    this.commandManager = new CommandManager({ editor: this });
  }

  setSelection(start: number, end: number) {
    const { tr } = this.state;
    let resolvedStart = tr.doc.resolve(start);
    let resolvedEnd = tr.doc.resolve(end);
    // not stable
    if (resolvedStart && resolvedEnd) {
      const transaction = tr.setSelection(
        new TextSelection(resolvedStart, resolvedEnd)
      );
      this.state.apply(transaction);
    } else {
      // Handle out of range error
    }
  }

  contentAsJson() {
    return this.state.doc.content.toJSON() as JSONContent[] | JSONContent;
  }
  getNativeText() {
    return this.state.doc.textContent;
  }
}
