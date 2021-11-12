const mongoose = require("mongoose");
const { Schema } = mongoose;

const logSchema = new Schema({
  time: { type: Date, default: new Date() },
  source: { type: String },
  HTTPmethod: { type: String },
  pathID: { type: Schema.Types.ObjectId },
  nodeID: { type: Schema.Types.ObjectId },
  status: { type: Number, default: 0 },
  result: { type: Number },
  resultDetail: { type: String },
  response: { type: Schema.Types.ObjectId },
});

const AuditLog = mongoose.model("AuditLog", logSchema);
module.exports = AuditLog;
