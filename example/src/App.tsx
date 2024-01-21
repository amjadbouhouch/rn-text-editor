import * as React from 'react';

import { StyleSheet, View, TextInput, Button } from 'react-native';
import { useEditor, EditorContent, extensions } from 'rn-text-editor';
import { commonHelper } from '../../src/utils';
import Menu from './Menu';

export default function App() {
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
      {
        attrs: {
          id: `paragraph-${commonHelper.generateId()}`,
        },
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Shoutout to our amazing user community!',
          },
        ],
      },
      {
        attrs: {
          id: `paragraph-${commonHelper.generateId()}`,
        },
        type: 'paragraph',
        content: [
          {
            marks: [
              {
                type: 'highlight',
                attrs: {
                  color: '#FFC069',
                },
              },
            ],
            type: 'text',
            text: 'You are so amazing! ===> ',
          },
          {
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://github.com/',
                },
              },
            ],
            type: 'text',
            text: 'google.com',
          },
        ],
      },
    ],
    extensions: [extensions.Commands, extensions.Bold],
    onUpdate(props) {
      // console.log(JSON.stringify(props.editor.state.doc.content.toJSON()));
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
        />
        <Menu
          editor={editor}
          // key={`menu-${editor.state.selection.from}-${editor.state.selection.to}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  editorContainer: {
    paddingVertical: 20,
    paddingHorizontal: 5,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    // gray
    borderColor: '#ccc',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    // borderBottomWidth: 1,
    borderRadius: 0,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
