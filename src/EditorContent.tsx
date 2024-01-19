import React, { type ForwardedRef } from 'react';
import type { TextInputProps } from 'react-native';
import { TextInput } from 'react-native';
import { Editor } from './core/Editor';
import type { JSONContent, TextContentType } from './types';
import renderRules from './components/renderRules';
import type { NativeSyntheticEvent } from 'react-native';
import type { TextInputSelectionChangeEventData } from 'react-native';
import type { TextInputTextInputEventData } from 'react-native';
interface EditorContentProps
  extends Omit<TextInputProps, 'value' | 'multiline' | 'children'> {
  editor: Editor;
  inputRef?: ForwardedRef<TextInput>;
  renderNodes?: {
    [key: string]: (
      node: JSONContent | Array<JSONContent> | null,
      index: number,
      children: React.ReactNode
    ) => React.ReactNode;
  };
}

interface EditorContentState {}
export class EditorContent extends React.PureComponent<
  EditorContentProps,
  EditorContentState
> {
  onSelectionChange({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) {
    const selection = nativeEvent.selection;

    const { editor } = this.props;
    editor.setSelection(selection.start, selection.end);
  }
  onTextInput({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputTextInputEventData>) {
    this.props.editor.onTextInputChange(nativeEvent);
  }
  getRenderNodeFunction(type: TextContentType) {
    const { renderNodes = {} } = this.props;
    return renderNodes[type] || renderRules[type];
  }
  renderNode(
    node: JSONContent | Array<JSONContent> | null,
    index = 0
  ): React.ReactNode {
    if (!node) {
      return null;
    }
    if (Array.isArray(node)) {
      return node.map((child, index) => this.renderNode(child, index));
    }

    const renderFunction = this.getRenderNodeFunction(node.type);

    if (!renderFunction) {
      console.warn(`Unknown node type: ${node.type}`);
      return null;
    }

    const children = this.renderNode(node.content ?? null, 0);

    return renderFunction(node, index, children);
  }

  render(): React.ReactNode {
    const { editor, inputRef, ...rest } = this.props;
    const renderedNode = this.renderNode(editor.contentAsJson());

    return (
      <TextInput
        ref={inputRef}
        multiline
        // selection={selection}
        autoComplete="off"
        autoCorrect={false}
        onTextInput={this.onTextInput.bind(this)}
        onSelectionChange={this.onSelectionChange.bind(this)}
        autoCapitalize="none"
        spellCheck={false}
        {...rest}
      >
        {renderedNode}
      </TextInput>
    );
  }
}
