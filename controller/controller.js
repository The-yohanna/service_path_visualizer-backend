const Node = require("../models/nodes.model");
const Path = require("../models/paths.model");

export const NumChildren = async (id) => {
  let count = await Node.countDocuments({
    pathID: id,
  }).exec();
  return count;
};

export const Children = async (id) => {
  let children = await Node.find({ pathID: id }, { _id: 0, name: 1, state: 1 })
    .sort({ position: 1 })
    .exec();
  return children;
};
export const State = async (pathID) => {
  if (
    (await Node.countDocuments({
      pathID: pathID,
      state: { $lte: 0 },
    }).exec()) === 0
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
