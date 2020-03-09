export function callTrace() {
  const originalFunc = Error.prepareStackTrace;
  let caller: NodeJS.CallSite | undefined;

  try {
    const err = new Error() as Error & { stack: NodeJS.CallSite[] };
    Error.prepareStackTrace = function (_, stack) { return stack; };

    err.stack.shift();
    err.stack.shift();
    caller = err.stack.shift();

  } catch (e) {}

  Error.prepareStackTrace = originalFunc;

  return caller;
}
