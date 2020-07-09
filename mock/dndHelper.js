import Immutable from "immutable";

const { Map } = Immutable;

export default {
  blocks: [
    {
      key: "A",
      text: "",
      children: [
        {
          key: "E1",
          text:
            "EK: Tacos, because anything you eat with your hands is less intimidating than something that requires silverware. It takes you back to the permission of childhood, and that joy of just eating that is super direct. There is nothing in between you and the food.",
          children: []
        },
        {
          key: "E2",
          text:
            "**CS:** The highest point in my life is being with close family and friends, in the backyard over a fire, cooking over the course of many hours, sitting under the sky, and just filling this space with so much warmth. When I’m cooking there, I feel much more like an artist than when I worked in the highest-concept restaurants. They are like museums of food, accessible only with a certain level of literacy on the part of the diner, with a certain level of cultural experience and background.",
          children: []
        },
        {
          key: "E3",
          text:
            "**CS:** The highest point in my life is being with close family and friends, in the backyard over a fire, cooking over the course of many hours, sitting under the sky, and just filling this space with so much warmth. When I’m cooking there, I feel much more like an artist than when I worked in the highest-concept restaurants. They are like museums of food, accessible only with a certain level of literacy on the part of the diner, with a certain level of cultural experience and background.",
          children: []
        },
        {
          key: "B",
          text: "",
          data: new Map({ flexRow: true }),
          children: [
            {
              key: "B1",
              text: "",
              children: [
                {
                  key: "F",
                  text:
                    "Art to me often has an intellectual component. I think of food preparation as a craft–I don’t think of it as art.",
                  data: new Map({ flexRow: true }),
                  children: []
                },
                {
                  key: "B2",
                  text:
                    "Art to me often has an intellectual component. I think of food preparation as a craft–I don’t think of it as art.",
                  data: new Map({ flexRow: true }),
                  children: []
                },
                {
                  key: "B3",
                  text:
                    "Art to me often has an intellectual component. I think of food preparation as a craft–I don’t think of it as art.",
                  data: new Map({ flexRow: true }),
                  children: []
                }
              ]
            },
            {
              key: "C",
              text: "",
              children: [
                {
                  key: "F1",
                  text:
                    "Art to me often has an intellectual component. I think of food preparation as a craft–I don’t think of it as art.",
                  data: new Map({ flexRow: true }),
                  children: []
                },
                {
                  key: "F2",
                  text:
                    "Art to me often has an intellectual component. I think of food preparation as a craft–I don’t think of it as art.",
                  data: new Map({ flexRow: true }),
                  children: []
                },
                {
                  key: "F3",
                  text:
                    "Art to me often has an intellectual component. I think of food preparation as a craft–I don’t think of it as art.",
                  data: new Map({ flexRow: true }),
                  children: []
                }
              ]
            }
          ]
        },
        {
          key: "H",
          text:
            "EK: Tacos, because anything you eat with your hands is less intimidating than something that requires silverware. It takes you back to the permission of childhood, and that joy of just eating that is super direct. There is nothing in between you and the food.",
          children: []
        }
      ]
    }
  ],
  entityMap: {}
};
