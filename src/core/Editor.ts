import { Fragment, Schema } from 'prosemirror-model';
import { marks } from 'prosemirror-schema-basic';
import { EditorState, Transaction } from 'prosemirror-state';
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
  public schema!: Schema;
  public commandManager!: CommandManager;
  public state!: EditorState;
  public options: EditorProps = {
    initialContent: [],
    focusPosition: 'end',
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

    this.schema = new Schema({
      nodes: {
        doc: { content: 'block+' },
        paragraph: {
          content: 'inline*',
          group: 'block',
          attrs: { id: { default: null } },
          parseDOM: [
            {
              tag: 'p',
              // @ts-expect-error
              getAttrs: (dom) => ({ id: dom.getAttribute('id') }),
            },
          ],
          toDOM: (node) => ['p', { id: node.attrs.id }, 0],
        },
        text: { inline: true, group: 'inline' },
      },
      marks: marks,
    });
    const { initialContent, focusPosition } = this.options;
    const parsedContent = Fragment.fromArray(
      initialContent.map((item) => this.schema.nodeFromJSON(item))
    );
    const doc = this.schema.node('doc', null, parsedContent);

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
      schema: this.schema,
      doc: doc,
      selection: selection ?? undefined,
    });
    this.commandManager = new CommandManager({ editor: this });
    //
    setTimeout(() => {
      this.emit('create', { editor: this });
    }, 0);
  }
  dispatch(tr: Transaction) {
    const newState = this.state.apply(tr);
    this.state = newState;
    this.emit('update', { editor: this, transaction: tr });
  }
  public setOptions(options: Partial<EditorProps>) {
    this.options = { ...this.options, ...options };
  }

  contentAsJson() {
    return this.state.doc.content.toJSON() as JSONContent[] | JSONContent;
  }
  getNativeText() {
    return this.state.doc.textContent;
  }
}
