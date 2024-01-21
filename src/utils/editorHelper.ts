import {
  MarkType,
  Node as ProseMirrorNode,
  NodeType,
  ResolvedPos,
  Schema,
  Mark as ProseMirrorMark,
  Mark,
} from 'prosemirror-model';
// import type { Node } from "../core/Node";
import type {
  AnyExtension,
  FocusPosition,
  MarkRange,
  MaybeThisParameterType,
  NodeRange,
  Range,
  RemoveThis,
} from '../core/types';
import {
  EditorState,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { commonHelper } from '.';

export function resolveFocusPosition(
  doc: ProseMirrorNode,
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

export const getTextContentFromNodes = ($from: ResolvedPos, maxMatch = 500) => {
  let textBefore = '';

  const sliceEndPos = $from.parentOffset;

  $from.parent.nodesBetween(
    Math.max(0, sliceEndPos - maxMatch),
    sliceEndPos,
    (node, pos, parent, index) => {
      const chunk =
        node.type.spec.toText?.({
          node,
          pos,
          parent,
          index,
        }) ||
        node.textContent ||
        '%leaf%';

      textBefore += chunk.slice(0, Math.max(0, sliceEndPos - pos));
    }
  );

  return textBefore;
};

export function getExtensionField<T = any>(
  extension: AnyExtension,
  field: string,
  context?: Omit<MaybeThisParameterType<T>, 'parent'>
): RemoveThis<T> {
  if (extension.config[field] === undefined && extension.parent) {
    return getExtensionField(extension.parent, field, context);
  }

  if (typeof extension.config[field] === 'function') {
    const value = extension.config[field].bind({
      ...context,
      parent: extension.parent
        ? getExtensionField(extension.parent, field, context)
        : null,
    });

    return value;
  }

  return extension.config[field];
}

export function getNodeType(
  nameOrType: string | NodeType,
  schema: Schema
): NodeType {
  if (typeof nameOrType === 'string') {
    if (!schema.nodes[nameOrType]) {
      throw Error(
        `There is no node type named '${nameOrType}'. Maybe you forgot to add the extension?`
      );
    }

    return schema.nodes[nameOrType]!;
  }

  return nameOrType;
}

export function isNodeActive(
  state: EditorState,
  typeOrName: NodeType | string | null,
  attributes: Record<string, any> = {}
): boolean {
  const { from, to, empty } = state.selection;
  const type = typeOrName ? getNodeType(typeOrName, state.schema) : null;

  const nodeRanges: NodeRange[] = [];

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isText) {
      return;
    }

    const relativeFrom = Math.max(from, pos);
    const relativeTo = Math.min(to, pos + node.nodeSize);

    nodeRanges.push({
      node,
      from: relativeFrom,
      to: relativeTo,
    });
  });

  const selectionRange = to - from;
  const matchedNodeRanges = nodeRanges
    .filter((nodeRange) => {
      if (!type) {
        return true;
      }

      return type.name === nodeRange.node.type.name;
    })
    .filter((nodeRange) =>
      commonHelper.objectIncludes(nodeRange.node.attrs, attributes, {
        strict: false,
      })
    );

  if (empty) {
    return !!matchedNodeRanges.length;
  }

  const range = matchedNodeRanges.reduce(
    (sum, nodeRange) => sum + nodeRange.to - nodeRange.from,
    0
  );

  return range >= selectionRange;
}

export function getMarkType(
  nameOrType: string | MarkType,
  schema: Schema
): MarkType {
  if (typeof nameOrType === 'string') {
    if (!schema.marks[nameOrType]) {
      throw Error(
        `There is no mark type named '${nameOrType}'. Maybe you forgot to add the extension?`
      );
    }

    return schema.marks[nameOrType]!;
  }

  return nameOrType;
}

export function isMarkActive(
  state: EditorState,
  typeOrName: MarkType | string | null,
  attributes: Record<string, any> = {}
): boolean {
  const { empty, ranges } = state.selection;
  const type = typeOrName ? getMarkType(typeOrName, state.schema) : null;

  if (empty) {
    return !!(state.storedMarks || state.selection.$from.marks())
      .filter((mark) => {
        if (!type) {
          return true;
        }

        return type.name === mark.type.name;
      })
      .find((mark) =>
        commonHelper.objectIncludes(mark.attrs, attributes, { strict: false })
      );
  }

  let selectionRange = 0;
  const markRanges: MarkRange[] = [];

  ranges.forEach(({ $from, $to }) => {
    const from = $from.pos;
    const to = $to.pos;

    state.doc.nodesBetween(from, to, (node, pos) => {
      if (!node.isText && !node.marks.length) {
        return;
      }

      const relativeFrom = Math.max(from, pos);
      const relativeTo = Math.min(to, pos + node.nodeSize);
      const range = relativeTo - relativeFrom;

      selectionRange += range;

      markRanges.push(
        ...node.marks.map((mark) => ({
          mark,
          from: relativeFrom,
          to: relativeTo,
        }))
      );
    });
  });

  if (selectionRange === 0) {
    return false;
  }

  // calculate range of matched mark
  const matchedRange = markRanges
    .filter((markRange) => {
      if (!type) {
        return true;
      }

      return type.name === markRange.mark.type.name;
    })
    .filter((markRange) =>
      commonHelper.objectIncludes(markRange.mark.attrs, attributes, {
        strict: false,
      })
    )
    .reduce((sum, markRange) => sum + markRange.to - markRange.from, 0);

  // calculate range of marks that excludes the searched mark
  // for example `code` doesn’t allow any other marks
  const excludedRange = markRanges
    .filter((markRange) => {
      if (!type) {
        return true;
      }

      return markRange.mark.type !== type && markRange.mark.type.excludes(type);
    })
    .reduce((sum, markRange) => sum + markRange.to - markRange.from, 0);

  // we only include the result of `excludedRange`
  // if there is a match at all
  const range = matchedRange > 0 ? matchedRange + excludedRange : matchedRange;

  return range >= selectionRange;
}

export function getSchemaTypeNameByName(
  name: string,
  schema: Schema
): 'node' | 'mark' | null {
  if (schema.nodes[name]) {
    return 'node';
  }

  if (schema.marks[name]) {
    return 'mark';
  }

  return null;
}

export function isActive(
  state: EditorState,
  name: string | null,
  attributes: Record<string, any> = {}
): boolean {
  if (!name) {
    return (
      isNodeActive(state, null, attributes) ||
      isMarkActive(state, null, attributes)
    );
  }

  const schemaType = getSchemaTypeNameByName(name, state.schema);

  if (schemaType === 'node') {
    return isNodeActive(state, name, attributes);
  }

  if (schemaType === 'mark') {
    return isMarkActive(state, name, attributes);
  }

  return false;
}

function findMarkInSet(
  marks: ProseMirrorMark[],
  type: MarkType,
  attributes: Record<string, any> = {}
): ProseMirrorMark | undefined {
  return marks.find((item) => {
    return (
      item.type === type && commonHelper.objectIncludes(item.attrs, attributes)
    );
  });
}

function isMarkInSet(
  marks: ProseMirrorMark[],
  type: MarkType,
  attributes: Record<string, any> = {}
): boolean {
  return !!findMarkInSet(marks, type, attributes);
}

export function getMarkRange(
  $pos: ResolvedPos,
  type: MarkType,
  attributes: Record<string, any> = {}
): Range | void {
  if (!$pos || !type) {
    return;
  }

  let start = $pos.parent.childAfter($pos.parentOffset);

  if ($pos.parentOffset === start.offset && start.offset !== 0) {
    start = $pos.parent.childBefore($pos.parentOffset);
  }

  if (!start.node) {
    return;
  }

  const mark = findMarkInSet([...start.node.marks], type, attributes);

  if (!mark) {
    return;
  }

  let startIndex = start.index;
  let startPos = $pos.start() + start.offset;
  let endIndex = startIndex + 1;
  let endPos = startPos + start.node.nodeSize;

  findMarkInSet([...start.node.marks], type, attributes);

  while (
    startIndex > 0 &&
    mark.isInSet($pos.parent.child(startIndex - 1).marks)
  ) {
    startIndex -= 1;
    startPos -= $pos.parent.child(startIndex).nodeSize;
  }

  while (
    endIndex < $pos.parent.childCount &&
    isMarkInSet([...$pos.parent.child(endIndex).marks], type, attributes)
  ) {
    endPos += $pos.parent.child(endIndex).nodeSize;
    endIndex += 1;
  }

  return {
    from: startPos,
    to: endPos,
  };
}

export function isTextSelection(value: unknown): value is TextSelection {
  return value instanceof TextSelection;
}

export function getMarkAttributes(
  state: EditorState,
  typeOrName: string | MarkType
): Record<string, any> {
  const type = getMarkType(typeOrName, state.schema);
  const { from, to, empty } = state.selection;
  const marks: Mark[] = [];

  if (empty) {
    if (state.storedMarks) {
      marks.push(...state.storedMarks);
    }

    marks.push(...state.selection.$head.marks());
  } else {
    state.doc.nodesBetween(from, to, (node) => {
      marks.push(...node.marks);
    });
  }

  const mark = marks.find((markItem) => markItem.type.name === type.name);

  if (!mark) {
    return {};
  }

  return { ...mark.attrs };
}

export function getMarksBetween(
  from: number,
  to: number,
  doc: ProseMirrorNode
): MarkRange[] {
  const marks: MarkRange[] = [];

  // get all inclusive marks on empty selection
  if (from === to) {
    doc
      .resolve(from)
      .marks()
      .forEach((mark) => {
        const $pos = doc.resolve(from - 1);
        const range = getMarkRange($pos, mark.type);

        if (!range) {
          return;
        }

        marks.push({
          mark,
          ...range,
        });
      });
  } else {
    doc.nodesBetween(from, to, (node, pos) => {
      if (!node || node.nodeSize === undefined) {
        return;
      }

      marks.push(
        ...node.marks.map((mark) => ({
          from: pos,
          to: pos + node.nodeSize,
          mark,
        }))
      );
    });
  }

  return marks;
}
