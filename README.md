# rn-text-editor (NOT STABLE!!!!!!!)

rn-text-editor - Inspired by [ProseMirror](https://prosemirror.net/) and [Tiptap](https://tiptap.dev/)

`rn-text-editor` is an evolving and feature-rich text editor package for React Native that's currently under active development. This package offers a range of functionalities for creating and managing text content in your React Native applications. `While it's not stable yet`, we invite you to explore its capabilities, contribute to its improvement, and share your feedback with the community.

## TODO

- [x] Setup a basic schema
- [x] Handle cursor position (Selection)
- [ ] handle onKeyPressed (insert new text or remove it based on the selection)
- [ ] Menu actions
- [ ] Plugins


## Features

1.  Customizable: Tailor the text editor to suit your application's requirements with various configuration options.
2. Rich Text Support: Easily incorporate rich text elements, such as bold and italic formatting, into your content.

## Installation

To get started with rn-text-editor, install the package using npm or yarn:
```sh
npm install rn-text-editor
# or
yarn add rn-text-editor

```

## Usage

Explore the package in its current state and feel free to contribute to its development. Integration is straightforward and can be done as follows:

```js
import * as React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { useEditor, EditorContent } from 'rn-text-editor';

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
});

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
