const removeIntermediateCtxValue = (ctx, actions) => {
  delete ctx.action;
  actions.next();
};

export default removeIntermediateCtxValue;
