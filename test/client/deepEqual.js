/* lease note that this function doesn't handle circular references. 
This occurs when a property of an object refers to the object itself. 
Also, this function does not take into account the ordering of keys in objects, 
as this does not matter in JavaScript. */

export function deepEqual(a, b) {
  // Check if a and b are the same type
  if (typeof a !== typeof b) return false;

  // If a and b are not objects (or null), we can directly compare them
  if (typeof a !== 'object' || a === null || b === null) return a === b;

  // If a and b are arrays, check if they have the same length and elements
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }

    return true;
  }

  // If a and b are objects, check if they have the same keys and values
  if (!Array.isArray(a) && !Array.isArray(b)) {
    let keysA = Object.keys(a);
    let keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (let key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
}
