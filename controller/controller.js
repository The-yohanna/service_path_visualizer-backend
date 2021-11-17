const Node = require("../models/nodes.model");
const Path = require("../models/paths.model");

export const Children = async (id) => {
  let count = await Node.countDocuments({
    pathID: id,
  }).exec();
  return count;
};

export const State = async (pathID) => {
  if (
    (await Node.countDocuments({ pathID: pathID, state: -1 || 0 }).exec()) === 0
  ) {
    return 1;
  } else if (
    (await Node.countDocuments({ pathID: pathID, state: -1 }).exec()) >= 1
  ) {
    return -1;
  } else {
    return 0;
  }
};
