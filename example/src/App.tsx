import * as React from 'react';

import { StyleSheet, View, TextInput } from 'react-native';
import { useEditor, EditorContent } from 'rn-text-editor';
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
            text: 'Hello',
          },
          {
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
