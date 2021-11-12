const Node = require("../models/nodes.model");
const Path = require("../models/paths.model");

export const Children = (pathID) => {
  let count = Node.find({ pathID: pathID }).count().exec();
  return count;
};

export const State = (pathID) => {
  if (
    Node.find({ pathID: pathID, state: -1 || 0 })
      .count()
      .exec() === 0
  ) {
    Path.updateOne({ _id: pathID }, { state: 1 }).exec();
  } else if (Node.find({ pathID: pathID, state: -1 }).count().exec() >= 1) {
    Path.updateOne({ _id: pathID }, { state: -1 }).exec();
  } else {
    Path.updateOne({ _id: pathID }, { state: 0 }).exec();
  }
};
