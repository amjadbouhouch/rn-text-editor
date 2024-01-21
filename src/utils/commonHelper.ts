import type { MaybeReturnType } from '../core/types';

export function nonCircularClone(obj: object) {
  const seen: object[] = [obj];

  function clone(obj: any, seen: any[]) {
    let value,
      name,
      newSeen,
      result: Record<string, any> | string = {};

    try {
      for (name in obj) {
        value = obj[name];

        if (value && typeof value === 'object') {
          if (seen.includes(value)) {
            result[name] = 'Removed circular reference: ' + typeof value;
          } else {
            newSeen = seen.slice();
            newSeen.push(value);
            result[name] = clone(value, newSeen);
          }
          continue;
        }

        result[name] = value;
      }
    } catch (e) {
      let errorMessage = 'Failed cloning custom data: ';
      if (e && typeof e === 'object' && 'message' in e) {
        errorMessage += e.message;
      }
      result = errorMessage;
    }
    return result;
  }
  return clone(obj, seen);
}

export function generateId() {
  return Math.random().toString(16).substring(2);
}
export function deepClone(payload: object) {
  structuredClone(payload);
}

export function minMax(value = 0, min = 0, max = 0): number {
  return Math.min(Math.max(value, min), max);
}

// export function generateId() {
//   return Math.random().toString(16).substring(2);
// }
export function isRegExp(value: any): value is RegExp {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

function getType(value: any): string {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export function isPlainObject(value: any): value is Record<string, any> {
  if (getType(value) !== 'Object') {
    return false;
  }

  return (
    value.constructor === Object &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function mergeDeep(
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> {
  const output = { ...target };

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isPlainObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * Optionally calls `value` as a function.
 * Otherwise it is returned directly.
 * @param value Function or any value.
 * @param context Optional context to bind to function.
 * @param props Optional props to pass to function.
 */
export function callOrReturn<T>(
  value: T,
  context: any = undefined,
  ...props: any[]
): MaybeReturnType<T> {
  if (isFunction(value)) {
    if (context) {
      return value.bind(context)(...props);
    }

    return value(...props);
  }

  return value as MaybeReturnType<T>;
}

/**
 * Check if object1 includes object2
 * @param object1 Object
 * @param object2 Object
 */
export function objectIncludes(
  object1: Record<string, any>,
  object2: Record<string, any>,
  options: { strict: boolean } = { strict: true }
): boolean {
  const keys = Object.keys(object2);

  if (!keys.length) {
    return true;
  }

  return keys.every((key) => {
    if (options.strict) {
      return object2[key] === object1[key];
    }

    if (isRegExp(object2[key])) {
      return object2[key].test(object1[key]);
    }

    return object2[key] === object1[key];
  });
}
export function isEmptyObject(value = {}): boolean {
  return Object.keys(value).length === 0 && value.constructor === Object;
}
