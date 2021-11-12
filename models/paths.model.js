const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { Schema } = mongoose;

const connection = mongoose.connection;
autoIncrement.initialize(connection);

const pathSchema = new Schema({
  position: { type: Number, default: 0 },
  name: { type: String, required: true },
  numChildren: { type: Number, default: 0 },
  state: { type: Number, default: 0 },
});

pathSchema.plugin(autoIncrement.plugin, {
  model: "Path",
  field: "position",
  startAt: 1,
  incrementBy: 1,
  reset: "reset",
});
const Path = mongoose.model("Path", pathSchema);
module.exports = Path;
