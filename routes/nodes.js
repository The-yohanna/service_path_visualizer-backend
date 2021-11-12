const express = require("express");
const router = express.Router();
const Node = require("../models/nodes.model");
const AuditLog = require("../models/logs.model");

router.get("/", async (req, res) => {
  try {
    const nodes = await Node.find().exec();
    res.send(nodes);
  } catch (err) {
    res.status(err.code).send(err.message);
  }
});

router.get("/:nodeID", async (req, res) => {
  try {
    const node = await Node.findOne({ _id: req.params.nodeID }).exec();
    res.send(node);
  } catch (err) {
    res.status(err.code).send(err.message);
  }
});

router.post("/", async (req, res) => {
  const { pathID, name, state, prevPosition, nextPosition } = req.body;
  const node = new Node({
    pathID: pathID,
    name: name,
    state: state,
    prevPosition: prevPosition,
    nextPosition: nextPosition,
  });
  await node.save((err) => (err ? res.send(err) : res.status(200).send(node)));
  let auditlog = new AuditLog({
    source: req.headers["user-agent"],
    HTTPmethod: req.method,
    pathID: node.pathID,
    status: node.state,
    result: res.statusCode,
    resultDetail: res.statusMessage,
    response: node._id,
  });
  await auditlog.save();
  console.log(auditlog);
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, state, position } = req.body;
    Node.updateOne(
      { _id: req.params.id },
      { $set: { name: name, state: state, position: position } },
      { upsert: true }
    ).exec();

    res.send("update successful");
    let auditlog = new AuditLog({
      source: req.headers["user-agent"],
      HTTPmethod: req.method,
      pathID: updatednode.pathID,
      nodeID: updatednode.pathID,
      status: updatednode.status,
      result: res.statusCode,
      resultDetail: res.statusMessage,
    });
    await auditlog.save();
    console.log(auditlog);
  } catch (err) {
    res.status(err.code).send(err.message);
  }
});

router.delete("/", async (req, res) => {
  try {
    const { nodeID } = req.body;
    const deletednode = await Node.findOneAndDelete({ _id: nodeID }).exec();
    res.status(200).send("delete successful");
    let auditlog = new AuditLog({
      source: req.headers["user-agent"],
      HTTPmethod: req.method,
      pathID: deletednode.pathID,
      nodeID: deletednode.nodeID,
      status: deletednode.status,
      result: res.statusCode,
      resultDetail: res.statusMessage,
    });
    await auditlog.save();
    console.log(auditlog);
  } catch (err) {
    res.send(err.code).send(err.message);
  }
});

module.exports = router;
