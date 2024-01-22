import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { EditorContent, extensions, useEditor } from 'rn-text-editor';
import { commonHelper } from '../../src/utils';
import Menu from './EditorMenu';
import tw from './utils/tailwind';
interface EditorScreenProps {}
const EditorScreen = ({}: EditorScreenProps) => {
  const inputRef = React.useRef<TextInput>(null);
  const editor = useEditor({
    initialContent: [
      {
        attrs: {
          id: `paragraph-${commonHelper.generateId()}`,
        },
        type: 'paragraph',
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold',
              },
            ],
            text: 'Hey there, ',
          },
          {
            marks: [
              {
                type: 'bold',
              },
            ],
            type: 'text',
            text: '@ChatLover21',
            // content: [],
          },
          {
            type: 'text',
            text: ", your curiosity fuels the conversation! What's on your mind today?",
          },
        ],
      },
    ],
    extensions: [extensions.EditorCommands, extensions.Bold, extensions.Italic],
    onUpdate(props) {
      console.log(props.editor.getNativeText());
    },
  });
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} />
      <View style={styles.editorContainer}>
        <EditorContent
          editor={editor}
          placeholder="Write something..."
          inputRef={inputRef}
          autoFocus
          style={tw`pl-2`}
        />
        <Menu editor={editor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  editorContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 5,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    // gray
    borderColor: tw.color('gray-200'),
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

export default EditorScreen;
