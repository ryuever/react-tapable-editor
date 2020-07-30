let containerIndex = 0;
let draggerIndex = 0;

export const containerKeyExtractor = () => `ctx_${containerIndex++}`;
export const draggerKeyExtractor = () => `dragger_${draggerIndex++}`;
