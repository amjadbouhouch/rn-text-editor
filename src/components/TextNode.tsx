import React from 'react';
import { Linking, Text } from 'react-native';
import type { JSONContent } from '../core/types';

const TextNode = (node: JSONContent) => {
  const isBold = node?.marks?.some((m) => m.type === 'bold');
  const isItalic = node?.marks?.some((m) => m.type === 'italic');
  const urlLinks = node?.marks?.find((m) => m.type === 'link');
  const isStrike = node?.marks?.find((m) => m.type === 'strike');
  const textStyle = node?.marks?.find((m) => m.type === 'textStyle');
  const highlight = node?.marks?.find((m) => m.type === 'highlight');

  const onPress = () => {
    if (!urlLinks) {
      return;
    }

    Linking.openURL(urlLinks.attrs!.href);
  };

  return (
    <Text
      onPress={urlLinks ? onPress : undefined}
      style={[
        {
          fontWeight: isBold ? 'bold' : undefined,
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecorationLine: isStrike ? 'line-through' : undefined,
        },
        urlLinks && {
          color: '#0000EE',
          textDecorationLine: 'underline',
        },
        textStyle && { color: textStyle.attrs?.color },
        highlight && {
          backgroundColor: highlight.attrs?.color || '#FFC069',
        },
      ]}
      children={node.text}
    />
  );
};

export default TextNode;
