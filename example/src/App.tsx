import * as React from 'react';

import { StyleSheet, View, TextInput, Button } from 'react-native';
import { useEditor, EditorContent, Bold, Commands } from 'rn-text-editor';
import { commonHelper } from '../../src/utils';

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
    extensions: [Commands, Bold],
    onUpdate(props) {
      // console.log(JSON.stringify(props.editor.state.doc.content.toJSON()));
    },
  });
  React.useEffect(() => {
    // console.log(editor.isActive('bold'));
    // console.log(typeof editor.commandManager.can().);
  }, [editor]);
  function setBold() {
    if (editor.commandManager.createCan().toggleMark('bold')) {
      editor.commandManager
        .createChain(undefined, true)
        .toggleMark('bold')
        .run();
    }
  }
  function selectAll() {
    if (editor.commandManager.createCan().selectAll()) {
      editor.commandManager.createChain(undefined, true).selectAll().run();
    }
  }
  return (
    <View style={styles.container}>
      <EditorContent
        editor={editor}
        inputRef={inputRef}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 5,
          backgroundColor: '#fff',
          // gray
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
        }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 10,
        }}
      >
        <Button title="SelectAll" onPress={selectAll} />
        <View
          style={{
            marginLeft: 10,
          }}
        >
          <Button title="set bold" onPress={setBold} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
