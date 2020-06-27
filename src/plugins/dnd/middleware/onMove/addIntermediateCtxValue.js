const addIntermediateCtxValue = (ctx, actions) => {
  ctx.action = {};

  actions.next();
};

export default addIntermediateCtxValue;
