export function logger(message, meta = {}) {
  if (process.env.NODE_ENV === "test") return;
  console.log(message, meta);
}

export function logError(message, meta = {}) {
  console.error(message, meta);
}

