function decorateComposer(...funcs) {
  if (!funcs.length) return args => args;
  // if (funcs.length === 1) return (...args) =>
  //   funcs[0].apply(this, [decorateComposer.getEditor, ...args])

  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => {
    console.log("args  : ", a);
    // return a(b(...args))
    return a(b(args[0].bind(this, 3))).bind(this, 4);
  });
  // return funcs.reduce((a, b) => (...args) => a(b.apply(this, [decorateComposer.getEditor, ...args])))
}

export default decorateComposer;
