import type { Extension } from '../core/Extension';
import type { Mark } from '../core/Mark';
import type { Extensions } from '../core/types';
import type { Node } from '../core/Node';

export function splitExtensions(extensions: Extensions) {
  const baseExtensions = extensions.filter(
    (extension) => extension.type === 'extension'
  ) as Extension[];
  const nodeExtensions = extensions.filter(
    (extension) => extension.type === 'node'
  ) as Node[];
  const markExtensions = extensions.filter(
    (extension) => extension.type === 'mark'
  ) as Mark[];

  return {
    baseExtensions,
    nodeExtensions,
    markExtensions,
  };
}
