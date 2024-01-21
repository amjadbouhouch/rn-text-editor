import { Fragment, Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { editorHelper } from '../utils';
import { CommandManager } from './CommandManager';
import { EventEmitter } from './EventEmitter';
import { ExtensionManager } from './ExtensionManager';
import * as extensions from './Extensions/index';
import type {
  AnyExtension,
  ChainedCommands,
  EditorEvents,
  Extensions,
  FocusPosition,
  JSONContent,
  SingleCommands,
} from './types';
export type EditorProps = {
  extensions: Extensions;
  initialContent: JSONContent[];
  focusPosition?: FocusPosition;
  enableCoreExtensions?: boolean;
  enableInputRules?: boolean;
  enablePasteRules?: boolean;
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
  public extensionManager!: ExtensionManager;
  public state!: EditorState;
  public extensionStorage: Record<string, any> = {};

  public options: EditorProps = {
    extensions: [],
    initialContent: [],
    focusPosition: 'end',
    enableCoreExtensions: false,
    enableInputRules: false,
    enablePasteRules: false,
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
      marks: {
        bold: { parseDOM: [{ tag: 'strong' }], toDOM: () => ['strong', 0] },
        // italic
        italic: { parseDOM: [{ tag: 'em' }], toDOM: () => ['em', 0] },
        strike: {
          parseDOM: [{ tag: 's' }],
          toDOM: () => ['s', 0],
        },
        highlight: {
          parseDOM: [{ tag: 'mark' }],
          toDOM: () => ['mark', 0],
          attrs: {
            color: {
              default: null,
            },
          },
        },
        link: {
          attrs: {
            href: {
              default: null,
            },
            label: {
              default: null,
            },
          },
          parseDOM: [
            {
              tag: 'a',
              getAttrs: (dom) => ({
                // @ts-expect-error
                href: dom.getAttribute('href'),
                // @ts-expect-error
                label: dom.getAttribute('label'),
              }),
            },
          ],
          toDOM: (node) => [
            'a',
            { href: node.attrs.href, label: node.attrs.label },
            0,
          ],
        },
        // strikethrough
        // code
      },
    });
    this.createExtensionManager();

    this.commandManager = new CommandManager({ editor: this });
    //
    // this.schema = this.extensionManager.schema;

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

    //
    setTimeout(() => {
      this.emit('create', { editor: this });
    }, 0);
  }
  /**
   * Creates an extension manager.
   */
  private createExtensionManager() {
    const coreExtensions = this.options.enableCoreExtensions
      ? Object.values(extensions)
      : [];
    const allExtensions = [
      ...coreExtensions,
      ...this.options.extensions,
    ].filter((extension) => {
      if (!extension || !('type' in extension)) return false;
      return ['extension', 'node', 'mark'].includes(extension.type);
    }) as AnyExtension[];

    this.extensionManager = new ExtensionManager(
      allExtensions,
      this,
      this.schema
    );
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
  // public isActive(name: string, attributes?: {}): boolean;
  // public isActive(attributes: {}): boolean;
  isActive(nameOrAttributes: string | {}, attributesOrUndefined?: {}): boolean {
    const name = typeof nameOrAttributes === 'string' ? nameOrAttributes : null;

    const attributes =
      typeof nameOrAttributes === 'string'
        ? attributesOrUndefined
        : nameOrAttributes;

    return editorHelper.isActive(this.state, name, attributes);
  }

  /**
   * Create a command chain to call multiple commands at once.
   */
  public chain(): ChainedCommands {
    return this.commandManager.chain();
  }
  /**
   * An object of all registered commands.
   */
  public get commands(): SingleCommands {
    return this.commandManager.commands;
  }
}
