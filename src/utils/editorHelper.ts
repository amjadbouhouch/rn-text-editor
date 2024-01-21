import { Node } from 'prosemirror-model';
import type { FocusPosition } from '../types';
import {
  EditorState,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { commonHelper } from '.';

export function resolveFocusPosition(
  doc: Node,
  position: FocusPosition = null
): Selection | null {
  if (!position) {
    return null;
  }

  const selectionAtStart = Selection.atStart(doc);
  const selectionAtEnd = Selection.atEnd(doc);

  if (position === 'start' || position === true) {
    return selectionAtStart;
  }

  if (position === 'end') {
    return selectionAtEnd;
  }

  const minPos = selectionAtStart.from;
  const maxPos = selectionAtEnd.to;

  if (position === 'all') {
    return TextSelection.create(
      doc,
      commonHelper.minMax(0, minPos, maxPos),
      commonHelper.minMax(doc.content.size, minPos, maxPos)
    );
  }

  return TextSelection.create(
    doc,
    commonHelper.minMax(position, minPos, maxPos),
    commonHelper.minMax(position, minPos, maxPos)
  );
}
export function isOutOfRange(
  position: number,
  minPos: number,
  maxPos: number
): boolean {
  return position < minPos || position > maxPos;
}

export function createChainableState(config: {
  transaction: Transaction;
  state: EditorState;
}): EditorState {
  const { state, transaction } = config;
  let { selection } = transaction;
  let { doc } = transaction;
  let { storedMarks } = transaction;

  return {
    ...state,
    apply: state.apply.bind(state),
    applyTransaction: state.applyTransaction.bind(state),
    plugins: state.plugins,
    schema: state.schema,
    reconfigure: state.reconfigure.bind(state),
    toJSON: state.toJSON.bind(state),
    get storedMarks() {
      return storedMarks;
    },
    get selection() {
      return selection;
    },
    get doc() {
      return doc;
    },
    get tr() {
      selection = transaction.selection;
      doc = transaction.doc;
      storedMarks = transaction.storedMarks;

      return transaction;
    },
  };
}
export function createParagraphNode(attrs: Record<string, unknown> = {}) {
  return {
    type: 'paragraph',
    content: [{ type: 'text', text: '' }],
    attrs,
  };
}
