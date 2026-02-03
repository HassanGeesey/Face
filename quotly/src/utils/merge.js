/**
 * Deep merge two objects
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
export function deepMerge(target, source) {
  if (!source) return target;
  const output = { ...target };
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!(key in target)) {
        Object.assign(output, { [key]: source[key] });
      } else {
        output[key] = deepMerge(target[key], source[key]);
      }
    } else {
      Object.assign(output, { [key]: source[key] });
    }
  });
  return output;
}
