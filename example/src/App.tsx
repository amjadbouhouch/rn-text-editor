import * as React from 'react';

import { StyleSheet, View, TextInput } from 'react-native';
import { useEditor, EditorContent } from 'react-native-rn-text-editor';

export default function App() {
  const inputRef = React.useRef<TextInput>(null);
  const editor = useEditor({
    initialContent: [
      {
        id: '1',
        type: 'paragraph',
        content: [
          {
            id: '1.1d',
            type: 'text',
            text: 'Hello',
          },
          {
            id: '1.2',
            type: 'text',
            marks: [
              {
                type: 'strong',
              },
            ],
            text: 'Hello',
          },
        ],
      },
    ],
  });

  return (
    <View style={styles.container}>
      <EditorContent editor={editor} inputRef={inputRef} />
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
