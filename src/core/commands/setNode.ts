import { setBlockType } from 'prosemirror-commands';
import type { NodeType } from 'prosemirror-model';
import type { RawCommands } from '../types';
import { getNodeType } from '../../utils/editorHelper';

declare module 'rn-text-editor' {
  interface Commands<ReturnType> {
    setNode: {
      /**
       * Replace a given range with a node.
       */
      setNode: (
        typeOrName: string | NodeType,
        attributes?: Record<string, any>
      ) => ReturnType;
    };
  }
}

export const setNode: RawCommands['setNode'] =
  (typeOrName, attributes = {}) =>
  ({ state, dispatch, chain }) => {
    const type = getNodeType(typeOrName, state.schema);

    // TODO: use a fallback like insertContent?
    if (!type.isTextblock) {
      console.warn('Currently "setNode()" only supports text block nodes.');

      return false;
    }

    return (
      chain()
        // try to convert node to default node if needed
        .command(({ commands }) => {
          const canSetBlock = setBlockType(type, attributes)(state);

          if (canSetBlock) {
            return true;
          }

          return commands.clearNodes();
        })
        .command(({ state: updatedState }) => {
          return setBlockType(type, attributes)(updatedState, dispatch);
        })
        .run()
    );
  };
