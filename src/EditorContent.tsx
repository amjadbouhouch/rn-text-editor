import React from 'react';
import type {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputProps,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { TextInput } from 'react-native';
import renderRules from './components/renderRules';
import { Editor } from './core/Editor';
import type { JSONContent, TextContentType } from './types';
interface EditorContentProps
  extends Omit<TextInputProps, 'value' | 'multiline' | 'children'> {
  editor: Editor;
  inputRef: React.RefObject<TextInput>;
  renderNodes?: {
    [key: string]: (
      node: JSONContent | Array<JSONContent> | null,
      index: number,
      children: React.ReactNode
    ) => React.ReactNode;
  };
}

interface EditorContentState {
  jsonContent: JSONContent | Array<JSONContent> | null;
}
export class EditorContent extends React.PureComponent<
  EditorContentProps,
  EditorContentState
> {
  constructor(props: EditorContentProps) {
    super(props);
    this.state = {
      jsonContent: props.editor.contentAsJson(),
    };
    props.editor.on('update', ({ editor }) =>
      this.setState({ jsonContent: editor.contentAsJson() })
    );
  }
  currentText = React.createRef<string>();
  onSelectionChange({
    nativeEvent: { selection },
  }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) {
    const { editor } = this.props;

    editor.commandManager.setSelection(selection.start, selection.end);
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
    if (!node.attrs?.id && node.type !== 'text') {
      console.warn(`Node without id: ${node.type}`);
    }
    const children = this.renderNode(node.content ?? null, 0);
    return renderFunction(node, index, children);
  }
  getNativeSelection(): { start: number; end?: number } | undefined {
    const { editor } = this.props;
    const editorSelection = editor.state.selection;
    const newSelection = {
      start: editorSelection.from - 1,
      end: editorSelection.to - 1,
    };
    return newSelection;
  }
  onKeyPress({
    nativeEvent: { key },
  }: NativeSyntheticEvent<TextInputKeyPressEventData>) {
    this.props.editor.commandManager.handleKeyPress(key);
  }
  render(): React.ReactNode {
    const { inputRef, ...rest } = this.props;

    const renderedNode = this.renderNode(this.state.jsonContent);
    return (
      <TextInput
        ref={inputRef}
        multiline
        autoFocus
        autoComplete="off"
        autoCorrect={false}
        selectTextOnFocus={false}
        onKeyPress={this.onKeyPress.bind(this)}
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
