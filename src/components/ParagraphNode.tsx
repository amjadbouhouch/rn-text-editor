import React from 'react';
import { Text } from 'react-native';
import type { JSONContent } from '../core/types';

type ParagraphNodeProps = JSONContent & {
  index: number;
};
function ParagraphNode({
  children,
  index = 0,
}: React.PropsWithChildren<ParagraphNodeProps>) {
  return (
    <Text style={{ justifyContent: 'center' }}>
      {index > 0 && <Text>{'\n\n'}</Text>}
      {children}
    </Text>
  );
}

export default ParagraphNode;
