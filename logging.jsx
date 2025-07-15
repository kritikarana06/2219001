export function logRequest(requestInfo) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...requestInfo,
  };
  console.log("LOG ENTRY:", logEntry);
}