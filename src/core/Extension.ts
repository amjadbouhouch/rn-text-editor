import type { Plugin, Transaction } from 'prosemirror-state';
import type { Editor } from './Editor';
import type { InputRule } from './InputRule';
import type {
  AnyConfig,
  Extensions,
  GlobalAttributes,
  ParentConfig,
  RawCommands,
} from './types';
import type { Mark } from './Mark';
import { commonHelper, editorHelper } from '../utils';
import type { ExtensionConfig } from 'rn-text-editor';

declare module 'rn-text-editor' {
  interface ExtensionConfig<Options = any, Storage = any> {
    [key: string]: any;

    /**
     * Name
     */
    name: string;

    /**
     * Priority
     */
    priority?: number;

    /**
     * Default options
     */
    defaultOptions?: Options;

    /**
     * Default Options
     */
    addOptions?: (this: {
      name: string;
      parent: Exclude<
        ParentConfig<ExtensionConfig<Options, Storage>>['addOptions'],
        undefined
      >;
    }) => Options;

    /**
     * Default Storage
     */
    addStorage?: (this: {
      name: string;
      options: Options;
      parent: Exclude<
        ParentConfig<ExtensionConfig<Options, Storage>>['addStorage'],
        undefined
      >;
    }) => Storage;

    /**
     * Global attributes
     */
    addGlobalAttributes?: (this: {
      name: string;
      options: Options;
      storage: Storage;
      parent: ParentConfig<
        ExtensionConfig<Options, Storage>
      >['addGlobalAttributes'];
    }) => GlobalAttributes | {};

    /**
     * Raw
     */
    addCommands?: (this: {
      name: string;
      options: Options;
      storage: Storage;
      editor: Editor;
      parent: ParentConfig<ExtensionConfig<Options, Storage>>['addCommands'];
    }) => Partial<RawCommands>;

    /**
     * Keyboard shortcuts
     */
    // addKeyboardShortcuts?: (this: {
    //   name: string
    //   options: Options
    //   storage: Storage
    //   editor: Editor
    //   parent: ParentConfig<ExtensionConfig<Options, Storage>>['addKeyboardShortcuts']
    // }) => {
    //   [key: string]: KeyboardShortcutCommand
    // }

    /**
     * Input rules
     */
    addInputRules?: (this: {
      name: string;
      options: Options;
      storage: Storage;
      editor: Editor;
      parent: ParentConfig<ExtensionConfig<Options, Storage>>['addInputRules'];
    }) => InputRule[];

    /**
     * Paste rules
     */
    // addPasteRules?: (this: {
    //   name: string
    //   options: Options
    //   storage: Storage
    //   editor: Editor
    //   parent: ParentConfig<ExtensionConfig<Options, Storage>>['addPasteRules']
    // }) => PasteRule[]

    /**
     * ProseMirror plugins
     */
    addProseMirrorPlugins?: (this: {
      name: string;
      options: Options;
      storage: Storage;
      editor: Editor;
      parent: ParentConfig<
        ExtensionConfig<Options, Storage>
      >['addProseMirrorPlugins'];
    }) => Plugin[];

    /**
     * Extensions
     */
    addExtensions?: (this: {
      name: string;
      options: Options;
      storage: Storage;
      parent: ParentConfig<ExtensionConfig<Options, Storage>>['addExtensions'];
    }) => Extensions;

    /**
     * Extend Node Schema
     */
    extendNodeSchema?:
      | ((
          this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<
              ExtensionConfig<Options, Storage>
            >['extendNodeSchema'];
          },
          extension: Node
        ) => Record<string, any>)
      | null;

    /**
     * Extend Mark Schema
     */
    extendMarkSchema?:
      | ((
          this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<
              ExtensionConfig<Options, Storage>
            >['extendMarkSchema'];
          },
          extension: Mark
        ) => Record<string, any>)
      | null;

    /**
     * The editor is not ready yet.
     */
    onBeforeCreate?:
      | ((this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          parent: ParentConfig<
            ExtensionConfig<Options, Storage>
          >['onBeforeCreate'];
        }) => void)
      | null;

    /**
     * The editor is ready.
     */
    onCreate?:
      | ((this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          parent: ParentConfig<ExtensionConfig<Options, Storage>>['onCreate'];
        }) => void)
      | null;

    /**
     * The content has changed.
     */
    onUpdate?:
      | ((this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          parent: ParentConfig<ExtensionConfig<Options, Storage>>['onUpdate'];
        }) => void)
      | null;

    /**
     * The selection has changed.
     */
    onSelectionUpdate?:
      | ((this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          parent: ParentConfig<
            ExtensionConfig<Options, Storage>
          >['onSelectionUpdate'];
        }) => void)
      | null;

    /**
     * The editor state has changed.
     */
    onTransaction?:
      | ((
          this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<
              ExtensionConfig<Options, Storage>
            >['onTransaction'];
          },
          props: {
            transaction: Transaction;
          }
        ) => void)
      | null;

    /**
     * The editor is focused.
     */
    onFocus?:
      | ((
          this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['onFocus'];
          },
          props: {
            event: FocusEvent;
          }
        ) => void)
      | null;

    /**
     * The editor isn’t focused anymore.
     */
    onBlur?:
      | ((
          this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            parent: ParentConfig<ExtensionConfig<Options, Storage>>['onBlur'];
          },
          props: {
            event: FocusEvent;
          }
        ) => void)
      | null;

    /**
     * The editor is destroyed.
     */
    onDestroy?:
      | ((this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          parent: ParentConfig<ExtensionConfig<Options, Storage>>['onDestroy'];
        }) => void)
      | null;
  }
}

export class Extension<Options = any, Storage = any> {
  type = 'extension';

  name = 'extension';

  parent: Extension | null = null;

  child: Extension | null = null;

  options: Options;

  storage: Storage;

  config: ExtensionConfig = {
    name: this.name,
    defaultOptions: {},
  };

  constructor(config: Partial<ExtensionConfig<Options, Storage>> = {}) {
    this.config = {
      ...this.config,
      ...config,
    };

    this.name = this.config.name;

    if (
      config.defaultOptions &&
      Object.keys(config.defaultOptions).length > 0
    ) {
      console.warn(
        `BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`
      );
    }

    // TODO: remove `addOptions` fallback
    this.options = this.config.defaultOptions;

    if (this.config.addOptions) {
      this.options = commonHelper.callOrReturn(
        editorHelper.getExtensionField<AnyConfig['addOptions']>(
          this,
          'addOptions',
          {
            name: this.name,
          }
        )
      );
    }

    this.storage =
      commonHelper.callOrReturn(
        editorHelper.getExtensionField<AnyConfig['addStorage']>(
          this,
          'addStorage',
          {
            name: this.name,
            options: this.options,
          }
        )
      ) || {};
  }

  static create<O = any, S = any>(config: Partial<ExtensionConfig<O, S>> = {}) {
    return new Extension<O, S>(config);
  }

  configure(options: Partial<Options> = {}) {
    // return a new instance so we can use the same extension
    // with different calls of `configure`
    const extension = this.extend();

    extension.options = commonHelper.mergeDeep(
      this.options as Record<string, any>,
      options
    ) as Options;

    extension.storage = commonHelper.callOrReturn(
      editorHelper.getExtensionField<AnyConfig['addStorage']>(
        extension,
        'addStorage',
        {
          name: extension.name,
          options: extension.options,
        }
      )
    );

    return extension;
  }

  extend<ExtendedOptions = Options, ExtendedStorage = Storage>(
    extendedConfig: Partial<
      ExtensionConfig<ExtendedOptions, ExtendedStorage>
    > = {}
  ) {
    const extension = new Extension<ExtendedOptions, ExtendedStorage>({
      ...this.config,
      ...extendedConfig,
    });

    extension.parent = this;

    this.child = extension;

    extension.name = extendedConfig.name
      ? extendedConfig.name
      : extension.parent.name;

    if (extendedConfig.defaultOptions) {
      console.warn(
        `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${extension.name}".`
      );
    }

    extension.options = commonHelper.callOrReturn(
      editorHelper.getExtensionField<AnyConfig['addOptions']>(
        extension,
        'addOptions',
        {
          name: extension.name,
        }
      )
    );

    extension.storage = commonHelper.callOrReturn(
      editorHelper.getExtensionField<AnyConfig['addStorage']>(
        extension,
        'addStorage',
        {
          name: extension.name,
          options: extension.options,
        }
      )
    );

    return extension;
  }
}