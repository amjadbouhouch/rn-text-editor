import { mergeAttributes } from '../../../utils/mergeAttributes';
import { Mark } from '../../Mark';
import { markInputRule } from '../../inputRules/markInputRule';

export interface ItalicOptions {
  HTMLAttributes: Record<string, any>;
}

declare module 'rn-text-editor' {
  interface Commands<ReturnType> {
    italic: {
      /**
       * Set an italic mark
       */
      setItalic: () => ReturnType;
      /**
       * Toggle an italic mark
       */
      toggleItalic: () => ReturnType;
      /**
       * Unset an italic mark
       */
      unsetItalic: () => ReturnType;
    };
  }
}

const starInputRegex = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/;
// const starPasteRegex = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g;
const underscoreInputRegex = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/;
// const underscorePasteRegex = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g;

export const Italic = Mark.create<ItalicOptions>({
  name: 'italic',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  // parseHTML() {
  //   return [
  //     {
  //       tag: 'strong',
  //     },
  //     {
  //       tag: 'b',
  //       getAttrs: (node) =>
  //         (node as HTMLElement).style.fontWeight !== 'normal' && null,
  //     },
  //     {
  //       style: 'font-weight',
  //       getAttrs: (value) =>
  //         /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
  //     },
  //   ];
  // },
  renderHTML({ HTMLAttributes }) {
    return [
      'em',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  // renderHTML({ HTMLAttributes }) {
  //   return ['strong', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  // },

  addCommands() {
    return {
      setItalic:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleItalic:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetItalic:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  // addKeyboardShortcuts() {
  //   return {
  //     'Mod-b': () => this.editor.commands.toggleBold(),
  //     'Mod-B': () => this.editor.commands.toggleBold(),
  //   };
  // },

  addInputRules() {
    return [
      markInputRule({
        find: starInputRegex,
        type: this.type,
      }),
      markInputRule({
        find: underscoreInputRegex,
        type: this.type,
      }),
    ];
  },

  // addPasteRules() {
  //   return [
  //     markPasteRule({
  //       find: starPasteRegex,
  //       type: this.type,
  //     }),
  //     markPasteRule({
  //       find: underscorePasteRegex,
  //       type: this.type,
  //     }),
  //   ];
  // },
});
