const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { Schema } = mongoose;

autoIncrement.initialize(mongoose.connection);

const nodeSchema = new Schema({
  pathID: { type: Schema.Types.ObjectId, required: true },
  position: { type: Number, default: 0 },
  name: { type: String, required: true },
  state: { type: Number, default: 0 },
  prevPosition: { type: Number, default: 0 },
  nextPosition: { type: Number, default: 0 },
});

nodeSchema.plugin(autoIncrement.plugin, {
  model: "Node",
  field: "position",
  startAt: 1,
  incrementBy: 1,
  reset: "reset",
});
const Node = mongoose.model("Node", nodeSchema);
module.exports = Node;

/*
const node = new Node({
  pathID: 1,
  nodeID: 1,
  name: "DNS connection",
  state: 0,
  prevPosition: 0,
  nextPosition: 1,
});
node.save((err) => {
  err ? console.log(err) : console.log("Saved succesfully");
});
*/
