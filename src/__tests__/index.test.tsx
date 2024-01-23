import { Editor } from '../core/Editor';
let editor: Editor;

beforeEach(() => {
  editor = new Editor({
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
        ],
      },
    ],
  });
});

//
test('inset new text', () => {
  const newTr = editor.state.tr.insertText(' World 🎁');
  editor.commandManager.dispatch(newTr);
  expect(editor.state.doc.textContent).toBe('Hello World 🎁');
});

// test('Add new paragraph', () => {
//   const newTr = editor.state.tr;
//   const textNode = editor.state.schema.text('hello');
//   const paragraphNode = editor.state.schema.nodes.paragraph.create(
//     {
//       id: '2',
//     },
//     textNode,
//     null
//   );
//   newTr.insert(editor.state.doc.content.size, paragraphNode);
//   editor.commandManager.dispatch(newTr);

// });
