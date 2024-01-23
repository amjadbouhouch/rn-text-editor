import { Node } from '../Node';

export const Document = Node.create({
  name: 'doc',
  topNode: true,
  content: 'block+',
});
