export const logger = {
  info: (message, ...args) => {
    if (args.length > 0) {
      console.log(message, ...args);
    } else {
      console.log(message);
    }
  },
  error: (message, ...args) => {
    if (args.length > 0) {
      console.error(message, ...args);
    } else {
      console.error(message);
    }
  },
  warn: (message, ...args) => {
    if (args.length > 0) {
      console.warn(message, ...args);
    } else {
      console.warn(message);
    }
  },
};

