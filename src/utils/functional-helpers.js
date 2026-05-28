/**
 * 🛡️ FUNCTIONAL HELPERS - DevSecOps Functional Programming Utilities
 *
 * Conjunto de utilidades funcionales para el ecosistema DevSecOps
 * Implementa funciones puras, composición y programación funcional
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

/**
 * Composes functions from right to left
 * @param {...Function} fns - Functions to compose
 * @returns {Function} Composed function
 * @example
 * const addThenMultiply = compose(x => x * 2, x => x + 1);
 * addThenMultiply(3); // => 8
 */
export const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);

/**
 * Pipes functions from left to right
 * @param {...Function} fns - Functions to pipe
 * @returns {Function} Piped function
 * @example
 * const addThenMultiply = pipe(x => x + 1, x => x * 2);
 * addThenMultiply(3); // => 8
 */
export const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);

/**
 * Curries a function
 * @param {Function} fn - Function to curry
 * @returns {Function} Curried function
 * @example
 * const add = (a, b) => a + b;
 * const curriedAdd = curry(add);
 * const add5 = curriedAdd(5);
 * add5(3); // => 8
 */
export const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...moreArgs) {
        return curried.apply(this, args.concat(moreArgs));
      };
    }
  };
};

/**
 * Partial application of a function
 * @param {Function} fn - Function to partially apply
 * @param {...any} partialArgs - Arguments to apply
 * @returns {Function} Partially applied function
 * @example
 * const multiply = (a, b, c) => a * b * c;
 * const multiplyBy2 = partial(multiply, 2);
 * multiplyBy2(3, 4); // => 24
 */
export const partial =
  (fn, ...partialArgs) =>
  (...restArgs) =>
    fn(...partialArgs, ...restArgs);

/**
 * Creates a memoized version of a function
 * @param {Function} fn - Function to memoize
 * @param {Function} keyFn - Function to generate cache key
 * @returns {Function} Memoized function
 * @example
 * const expensiveCalculation = memoize((n) => {
 *   console.log('Computing...');
 *   return n * n;
 * });
 */
export const memoize = (fn, keyFn = (...args) => JSON.stringify(args)) => {
  const cache = new Map();

  return (...args) => {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Maps over an array with error handling
 * @param {Function} fn - Mapping function
 * @param {Array} array - Array to map over
 * @returns {Array} Array of results or errors
 * @example
 * const results = safeMap(x => x / 0, [1, 2, 3]);
 * // Each result is either { success: true, data: value } or { success: false, error: Error }
 */
export const safeMap = (fn, array) =>
  array.map((item) => {
    try {
      return { success: true, data: fn(item) };
    } catch (error) {
      return { success: false, error };
    }
  });

/**
 * Filters array and maps successful results
 * @param {Function} predicate - Filter predicate
 * @param {Function} mapper - Mapping function
 * @param {Array} array - Array to process
 * @returns {Array} Filtered and mapped results
 * @example
 * const result = filterMap(x => x > 0, x => x * 2, [-1, 2, -3, 4]);
 * // => [4, 8]
 */
export const filterMap = (predicate, mapper, array) =>
  array.filter(predicate).map(mapper);

/**
 * Groups array elements by a key function
 * @param {Function} keyFn - Function to generate grouping key
 * @param {Array} array - Array to group
 * @returns {Object} Grouped object
 * @example
 * const grouped = groupBy(x => x.type, [
 *   { type: 'A', value: 1 },
 *   { type: 'B', value: 2 },
 *   { type: 'A', value: 3 }
 * ]);
 * // => { A: [{ type: 'A', value: 1 }, { type: 'A', value: 3 }], B: [{ type: 'B', value: 2 }] }
 */
export const groupBy = (keyFn, array) =>
  array.reduce((groups, item) => {
    const key = keyFn(item);
    return {
      ...groups,
      [key]: [...(groups[key] || []), item],
    };
  }, {});

/**
 * Creates a deep clone of an object
 * @param {any} obj - Object to clone
 * @returns {any} Deep cloned object
 * @example
 * const cloned = deepClone({ a: { b: { c: 1 } } });
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  if (typeof obj === "object") {
    const cloned = {};
    Object.keys(obj).forEach((key) => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }

  return obj;
};

/**
 * Safely gets a nested property from an object
 * @param {string} path - Dot-separated path to property
 * @param {Object} obj - Object to get property from
 * @param {any} defaultValue - Default value if property not found
 * @returns {any} Property value or default
 * @example
 * const value = get('user.profile.name', { user: { profile: { name: 'John' } } });
 * // => 'John'
 */
export const get = (path, obj, defaultValue = undefined) => {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result == null || typeof result !== "object") {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
};

/**
 * Safely sets a nested property in an object (immutably)
 * @param {string} path - Dot-separated path to property
 * @param {any} value - Value to set
 * @param {Object} obj - Object to set property in
 * @returns {Object} New object with property set
 * @example
 * const updated = set('user.profile.name', 'Jane', { user: { profile: { name: 'John' } } });
 */
export const set = (path, value, obj) => {
  const keys = path.split(".");
  const lastKey = keys.pop();

  const result = deepClone(obj);
  let current = result;

  for (const key of keys) {
    if (current[key] == null || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
  return result;
};

/**
 * Merges objects deeply
 * @param {...Object} objects - Objects to merge
 * @returns {Object} Merged object
 * @example
 * const merged = deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 });
 * // => { a: 1, b: { c: 2, d: 3 }, e: 4 }
 */
export const deepMerge = (...objects) => {
  const isObject = (obj) =>
    obj && typeof obj === "object" && !Array.isArray(obj);

  return objects.reduce((merged, obj) => {
    Object.keys(obj).forEach((key) => {
      if (isObject(merged[key]) && isObject(obj[key])) {
        merged[key] = deepMerge(merged[key], obj[key]);
      } else {
        merged[key] = obj[key];
      }
    });
    return merged;
  }, {});
};

/**
 * Debounces a function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 * @example
 * const debouncedSave = debounce(saveData, 300);
 */
export const debounce = (fn, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttles a function
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 * @example
 * const throttledHandler = throttle(handleScroll, 100);
 */
export const throttle = (fn, limit) => {
  let inThrottle;

  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Creates a predicate function for property matching
 * @param {string} property - Property name
 * @param {any} value - Value to match
 * @returns {Function} Predicate function
 * @example
 * const isActive = propEq('status', 'active');
 * const activeUsers = users.filter(isActive);
 */
export const propEq = (property, value) => (obj) => obj[property] === value;

/**
 * Creates a comparator function for sorting by property
 * @param {string} property - Property name to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Function} Comparator function
 * @example
 * const sortByName = sortBy('name', 'asc');
 * const sorted = users.sort(sortByName);
 */
export const sortBy = (property, order = "asc") => {
  const multiplier = order === "desc" ? -1 : 1;

  return (a, b) => {
    const aVal = get(property, a);
    const bVal = get(property, b);

    if (aVal < bVal) return -1 * multiplier;
    if (aVal > bVal) return 1 * multiplier;
    return 0;
  };
};

/**
 * Retries a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with function result or rejects
 * @example
 * const result = await retry(fetchData, 3, 1000);
 */
export const retry = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Creates a validator function from a schema
 * @param {Object} schema - Validation schema
 * @returns {Function} Validator function
 * @example
 * const validateUser = validate({
 *   name: (v) => typeof v === 'string' && v.length > 0,
 *   age: (v) => typeof v === 'number' && v >= 0
 * });
 */
export const validate = (schema) => (obj) => {
  const errors = [];

  Object.entries(schema).forEach(([key, validator]) => {
    const value = obj[key];
    const isValid =
      typeof validator === "function"
        ? validator(value)
        : validator.test(value);

    if (!isValid) {
      errors.push(`Invalid value for ${key}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Commonly used predicates
export const isString = (value) => typeof value === "string";
export const isNumber = (value) => typeof value === "number" && !isNaN(value);
export const isBoolean = (value) => typeof value === "boolean";
export const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
export const isArray = Array.isArray;
export const isFunction = (value) => typeof value === "function";
export const isNil = (value) => value == null;
export const isEmpty = (value) => {
  if (isNil(value)) return true;
  if (isString(value) || isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
};

// Functional helpers object for easy importing
export const FunctionalHelpers = Object.freeze({
  compose,
  pipe,
  curry,
  partial,
  memoize,
  safeMap,
  filterMap,
  groupBy,
  deepClone,
  get,
  set,
  deepMerge,
  debounce,
  throttle,
  propEq,
  sortBy,
  retry,
  validate,
  // Predicates
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isNil,
  isEmpty,
});

export default FunctionalHelpers;
