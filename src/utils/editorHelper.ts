import { Node } from 'prosemirror-model';
import type { FocusPosition } from '../types';
import { Selection, TextSelection } from 'prosemirror-state';
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
