import generateRandomKey from "draft-js/lib/generateRandomKey";
import ContentBlockNode from "draft-js/lib/ContentBlockNode";
import { Map, List } from "immutable";

export default () => {
  const blockKey = generateRandomKey();
  return new ContentBlockNode({
    key: blockKey,
    text: "",
    data: Map(),
    children: List(),
    type: "unstyled"
  });
};
