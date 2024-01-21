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
