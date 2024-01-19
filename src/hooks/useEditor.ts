import React from 'react';
import { Editor, type EditorProps } from '../core';
interface useEditorProps extends EditorProps {}
export const useEditor = ({ ...editorProps }: useEditorProps) => {
  const editor = React.useRef<Editor>(new Editor(editorProps)).current;
  return editor;
};
