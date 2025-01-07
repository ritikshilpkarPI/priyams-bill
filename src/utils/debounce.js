export const debounce = (func, delay) => {
  let timeoutId;

  return function (...args) {
    const context = this;

    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await func.apply(context, args); 
          resolve(result); 
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};
