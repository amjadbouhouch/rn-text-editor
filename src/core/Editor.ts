import { Fragment, Schema } from 'prosemirror-model';
import { marks, nodes } from 'prosemirror-schema-basic';
import { EditorState, TextSelection } from 'prosemirror-state';
import type { TextInputTextInputEventData } from 'react-native';
import type { EditorEvents, FocusPosition, JSONContent } from '../types';
import { editorHelper } from '../utils';
import { CommandManager } from './CommandManager';
import { EventEmitter } from './EventEmitter';
export type EditorProps = {
  initialContent: JSONContent[];
  focusPosition?: FocusPosition;
  onBeforeCreate: (props: EditorEvents['beforeCreate']) => void;
  onCreate: (props: EditorEvents['create']) => void;
  onUpdate: (props: EditorEvents['update']) => void;
  onSelectionUpdate: (props: EditorEvents['selectionUpdate']) => void;
  onTransaction: (props: EditorEvents['transaction']) => void;
  onFocus: (props: EditorEvents['focus']) => void;
  onBlur: (props: EditorEvents['blur']) => void;
  onDestroy: (props: EditorEvents['destroy']) => void;
};
export class Editor extends EventEmitter<EditorEvents> {
  private _schema!: Schema;
  public commandManager!: CommandManager;
  public state!: EditorState;
  public options: EditorProps = {
    initialContent: [],
    focusPosition: null,
    onBeforeCreate: () => null,
    onCreate: () => null,
    onUpdate: () => null,
    onSelectionUpdate: () => null,
    onTransaction: () => null,
    onFocus: () => null,
    onBlur: () => null,
    onDestroy: () => null,
  };
  constructor(options: Partial<EditorProps>) {
    super();
    this.setOptions(options);
    //

    this._schema = new Schema({
      nodes: nodes,
      marks: marks,
    });
    const { initialContent, focusPosition } = this.options;
    const parsedContent = Fragment.fromArray(
      initialContent.map((item) => this._schema.nodeFromJSON(item))
    );
    const doc = this._schema.node('doc', null, parsedContent);

    this.on('beforeCreate', this.options.onBeforeCreate);
    this.emit('beforeCreate', { editor: this });
    this.on('create', this.options.onCreate);
    this.on('update', this.options.onUpdate);
    this.on('selectionUpdate', this.options.onSelectionUpdate);
    this.on('transaction', this.options.onTransaction);
    this.on('focus', this.options.onFocus);
    this.on('blur', this.options.onBlur);
    this.on('destroy', this.options.onDestroy);

    const selection = editorHelper.resolveFocusPosition(doc, focusPosition);
    this.state = EditorState.create({
      schema: this._schema,
      doc: doc,
      selection: selection ?? undefined,
    });
    this.commandManager = new CommandManager({ editor: this });
    //
    setTimeout(() => {
      this.emit('create', { editor: this });
    }, 0);
  }

  public setOptions(options: Partial<EditorProps>) {
    this.options = { ...this.options, ...options };
  }

  setSelection(start: number, end: number) {
    const { tr } = this.state;

    let resolvedStart = this.state.doc.resolve(start);

    let resolvedEnd = this.state.doc.resolve(end);

    if (resolvedStart && resolvedEnd) {
      const transaction = tr.setSelection(
        new TextSelection(resolvedStart, resolvedEnd)
      );
      this.state.apply(transaction);
    } else {
    }
  }

  onTextInputChange({ range, text }: TextInputTextInputEventData) {
    const isDeleting = text === '';
    const { tr } = this.state;
    let resolvedStart = tr.doc.resolve(range.start);
    let resolvedEnd = tr.doc.resolve(range.end);

    if (isDeleting) {
      if (resolvedStart && resolvedEnd) {
        const transaction = tr.delete(resolvedStart.pos, resolvedEnd.pos);
        this.state.apply(transaction);
      }
    } else {
      if (resolvedStart && resolvedEnd) {
        const transaction = tr.insertText(
          text,
          resolvedStart.pos,
          resolvedEnd.pos
        );
        this.state.apply(transaction);
      }
    }
  }
  contentAsJson() {
    return this.state.doc.content.toJSON() as JSONContent[] | JSONContent;
  }
  getNativeText() {
    return this.state.doc.textContent;
  }
}
