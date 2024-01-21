import { Schema, type MarkSpec, type NodeSpec } from 'prosemirror-model';
import type { Editor, MarkConfig, NodeConfig } from '../core';
import type { AnyConfig, Extensions } from '../core/types';
import { callOrReturn, isEmptyObject } from './commonHelper';
import { getAttributesFromExtensions } from './getAttributesFromExtensions';
import { splitExtensions } from './splitExtensions';
import { getExtensionField } from './editorHelper';
import { injectExtensionAttributesToParseRule } from './injectExtensionAttributesToParseRule';
import { getRenderedAttributes } from './getRenderedAttributes';

function cleanUpSchemaItem<T>(data: T) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(data).filter(([key, value]) => {
      if (key === 'attrs' && isEmptyObject(value as {} | undefined)) {
        return false;
      }

      return value !== null && value !== undefined;
    })
  ) as T;
}

export function getSchemaByResolvedExtensions(
  extensions: Extensions,
  editor?: Editor
): Schema {
  const allAttributes = getAttributesFromExtensions(extensions);
  const { nodeExtensions, markExtensions } = splitExtensions(extensions);
  const topNode = nodeExtensions.find((extension) =>
    getExtensionField(extension, 'topNode')
  )?.name;

  const nodes = Object.fromEntries(
    nodeExtensions.map((extension) => {
      const extensionAttributes = allAttributes.filter(
        (attribute) => attribute.type === extension.name
      );
      const context = {
        name: extension.name,
        options: extension.options,
        storage: extension.storage,
        editor,
      };

      const extraNodeFields = extensions.reduce((fields, e) => {
        const extendNodeSchema = getExtensionField<
          AnyConfig['extendNodeSchema']
        >(e, 'extendNodeSchema', context);

        return {
          ...fields,
          // @ts-ignore
          ...(extendNodeSchema ? extendNodeSchema(extension) : {}),
        };
      }, {});

      const schema: NodeSpec = cleanUpSchemaItem({
        ...extraNodeFields,
        content: callOrReturn(
          getExtensionField<NodeConfig['content']>(
            extension,
            'content',
            context
          )
        ),
        marks: callOrReturn(
          getExtensionField<NodeConfig['marks']>(extension, 'marks', context)
        ),
        group: callOrReturn(
          getExtensionField<NodeConfig['group']>(extension, 'group', context)
        ),
        inline: callOrReturn(
          getExtensionField<NodeConfig['inline']>(extension, 'inline', context)
        ),
        atom: callOrReturn(
          getExtensionField<NodeConfig['atom']>(extension, 'atom', context)
        ),
        selectable: callOrReturn(
          getExtensionField<NodeConfig['selectable']>(
            extension,
            'selectable',
            context
          )
        ),
        draggable: callOrReturn(
          getExtensionField<NodeConfig['draggable']>(
            extension,
            'draggable',
            context
          )
        ),
        code: callOrReturn(
          getExtensionField<NodeConfig['code']>(extension, 'code', context)
        ),
        defining: callOrReturn(
          getExtensionField<NodeConfig['defining']>(
            extension,
            'defining',
            context
          )
        ),
        isolating: callOrReturn(
          getExtensionField<NodeConfig['isolating']>(
            extension,
            'isolating',
            context
          )
        ),
        attrs: Object.fromEntries(
          extensionAttributes.map((extensionAttribute) => {
            return [
              extensionAttribute.name,
              { default: extensionAttribute?.attribute?.default },
            ];
          })
        ),
      });

      const parseHTML = callOrReturn(
        getExtensionField<NodeConfig['parseHTML']>(
          extension,
          'parseHTML',
          context
        )
      );

      if (parseHTML) {
        schema.parseDOM = parseHTML.map((parseRule) =>
          injectExtensionAttributesToParseRule(parseRule, extensionAttributes)
        );
      }

      const renderHTML = getExtensionField<NodeConfig['renderHTML']>(
        extension,
        'renderHTML',
        // @ts-ignore
        context
      );

      if (renderHTML) {
        schema.toDOM = (node) =>
          // @ts-ignore
          renderHTML({
            node,
            HTMLAttributes: getRenderedAttributes(node, extensionAttributes),
          });
      }

      const renderText = getExtensionField<NodeConfig['renderText']>(
        extension,
        'renderText',
        // @ts-ignore
        context
      );

      if (renderText) {
        schema.toText = renderText;
      }

      return [extension.name, schema];
    })
  );

  const marks = Object.fromEntries(
    markExtensions.map((extension) => {
      const extensionAttributes = allAttributes.filter(
        (attribute) => attribute.type === extension.name
      );
      const context = {
        name: extension.name,
        options: extension.options,
        storage: extension.storage,
        editor,
      };

      const extraMarkFields = extensions.reduce((fields, e) => {
        const extendMarkSchema = getExtensionField<
          AnyConfig['extendMarkSchema']
        >(e, 'extendMarkSchema', context);

        return {
          ...fields,
          ...(extendMarkSchema ? extendMarkSchema(extension) : {}),
        };
      }, {});

      const schema: MarkSpec = cleanUpSchemaItem({
        ...extraMarkFields,
        inclusive: callOrReturn(
          getExtensionField<MarkConfig['inclusive']>(
            extension,
            'inclusive',
            context
          )
        ),
        excludes: callOrReturn(
          getExtensionField<MarkConfig['excludes']>(
            extension,
            'excludes',
            context
          )
        ),
        group: callOrReturn(
          getExtensionField<MarkConfig['group']>(extension, 'group', context)
        ),
        spanning: callOrReturn(
          getExtensionField<MarkConfig['spanning']>(
            extension,
            'spanning',
            context
          )
        ),
        code: callOrReturn(
          getExtensionField<MarkConfig['code']>(extension, 'code', context)
        ),
        attrs: Object.fromEntries(
          extensionAttributes.map((extensionAttribute) => {
            return [
              extensionAttribute.name,
              { default: extensionAttribute?.attribute?.default },
            ];
          })
        ),
      });

      const parseHTML = callOrReturn(
        getExtensionField<MarkConfig['parseHTML']>(
          extension,
          'parseHTML',
          context
        )
      );

      if (parseHTML) {
        schema.parseDOM = parseHTML.map((parseRule) =>
          injectExtensionAttributesToParseRule(parseRule, extensionAttributes)
        );
      }

      const renderHTML = getExtensionField<MarkConfig['renderHTML']>(
        extension,
        'renderHTML',
        // @ts-ignore
        context
      );

      if (renderHTML) {
        schema.toDOM = (mark) =>
          // @ts-ignore
          renderHTML({
            mark,
            HTMLAttributes: getRenderedAttributes(mark, extensionAttributes),
          });
      }

      return [extension.name, schema];
    })
  );

  return new Schema({
    topNode,
    nodes,
    marks,
  });
}
