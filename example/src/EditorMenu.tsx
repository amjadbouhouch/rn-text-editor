import React, { Fragment, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import { type Editor } from 'rn-text-editor';
import MenuButton from './MenuButton';
import tw from './utils/tailwind';
interface EditorMenuProps {
  editor: Editor;
}
const EditorMenu = ({ editor }: EditorMenuProps) => {
  const [_, setForceUpdate] = useState(false);
  useEffect(() => {
    editor.on('update', () => {
      setForceUpdate((prev) => !prev);
    });
  }, []);
  const actions = [
    {
      icon: 'format-bold',
      isActive: editor.isActive('bold'),
      disabled: !editor.commandManager.createCan().toggleMark('bold'),
      onPress() {
        if (editor.commandManager.createCan().toggleMark('bold')) {
          editor.commandManager
            .createChain(undefined, true)
            .toggleMark('bold')
            .run();
        }
      },
    },
    {
      icon: 'format-color-highlight',
      isActive: editor.isActive('highlight'),
      disabled: !editor.commandManager.createCan().toggleMark('highlight'),
      onPress() {
        if (editor.commandManager.createCan().toggleMark('highlight')) {
          editor.commandManager
            .createChain(undefined, true)
            .toggleMark('highlight')
            .run();
        }
      },
    },
  ];

  return (
    <View style={tw`flex flex-row items-center justify-start`}>
      {actions.map((action, index) => (
        <Fragment key={index}>
          <MenuButton
            key={action.icon}
            icon={action.icon}
            isActive={action.isActive}
            disabled={action.disabled}
            onPress={action.onPress}
          />
          {index < actions.length - 1 && (
            <Divider style={tw`w-0.5 bg-gray-300 h-[50%]`} />
          )}
        </Fragment>
      ))}
    </View>
  );
};

export default EditorMenu;
