module.exports = function (...args: any[]) {
  const parts = args.slice(0, args.length - 1);
  let str = "";
  parts.forEach((p) => (str += p));
  return str;
};
