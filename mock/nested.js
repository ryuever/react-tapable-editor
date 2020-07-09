import Immutable from "immutable";

const { Map } = Immutable;

export default {
  blocks: [
    {
      key: "A",
      text: "",
      children: [
        {
          key: "B",
          text: "",
          data: new Map({ flexRow: true }),
          children: [
            { key: "C", text: "left block", children: [] },
            { key: "D", text: "right block", children: [] }
          ]
        },
        {
          key: "E",
          type: "header-one",
          text: "This is a tree based document!",
          children: []
        }
      ]
    }
  ],
  entityMap: {}
};
