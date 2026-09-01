const colors = {
  reset: '\x1b[0m',
  info: '\x1b[36m',  // Cyan
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  debug: '\x1b[90m'  // Gray
};

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
  const color = colors[level.toLowerCase()] || colors.reset;
  return `${color}[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}${colors.reset}`;
};

const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  info: (message, meta) => {
    console.log(formatMessage('info', message, meta));
  },
  warn: (message, meta) => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message, error, meta) => {
    let errMsg = message;
    if (error instanceof Error) {
      errMsg = `${message} - ${error.message}\n${error.stack}`;
    } else if (error) {
      errMsg = `${message} - ${JSON.stringify(error)}`;
    }
    console.error(formatMessage('error', errMsg, meta));
  },
  debug: (message, meta) => {
    if (isDev) {
      console.log(formatMessage('debug', message, meta));
    }
  }
};
