import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { type Editor } from 'rn-text-editor';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { commonHelper } from '../../src/utils';
interface MenuProps {
  editor: Editor;
}
const Menu = ({ editor }: MenuProps) => {
  function toggleBold() {
    if (editor.commandManager.createCan().toggleMark('bold')) {
      editor.commandManager
        .createChain(undefined, true)
        .toggleMark('bold')
        .run();
    }
  }

  function toggleHighlight() {
    if (editor.commandManager.createCan().toggleMark('highlight')) {
      editor.commandManager
        .createChain(undefined, true)
        .toggleMark('highlight')
        .run();
    }
  }
  const canToggleBold = editor.commandManager.createCan().toggleMark('bold');
  const isBoldActive = editor.isActive('bold');
  const canToggleHighlight = editor.commandManager
    .createCan()
    .toggleMark('highlight');
  const isHighlightActive = editor.isActive('highlight');
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={!canToggleBold}
        onPress={toggleBold}
        style={[
          isBoldActive && { backgroundColor: 'lightgray' },
          styles.iconContainer,
        ]}
      >
        <FontAwesome
          name="bold"
          size={22}
          color={canToggleBold ? 'black' : 'gray'}
        />
      </TouchableOpacity>
      <Text> | </Text>
      <TouchableOpacity
        disabled={!canToggleBold}
        onPress={toggleHighlight}
        style={[
          isHighlightActive && { backgroundColor: 'lightgray' },
          styles.iconContainer,
        ]}
      >
        <MaterialCommunityIcons
          name="format-color-highlight"
          size={22}
          color={canToggleHighlight ? 'black' : 'gray'}
        />
      </TouchableOpacity>
      <Text> | </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 5,
  },
  iconContainer: {
    marginHorizontal: 5,
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 2,
  },
});

export default Menu;
