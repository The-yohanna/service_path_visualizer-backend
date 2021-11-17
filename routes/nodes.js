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

router.get("/:id", async (req, res) => {
  try {
    const node = await Node.findOne({ _id: req.params.id }).exec();
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
    let auditlog = new AuditLog({
      source: req.headers["user-agent"],
      HTTPmethod: req.method,
      nodeID: req.params.id,
      status: req.body.state,
      result: res.statusCode,
      resultDetail: res.statusMessage,
    });
    await auditlog.save();
    console.log(auditlog);
    return res.send("update successful");
  } catch (err) {
    res.status(err.code).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletednode = await Node.findOneAndDelete({
      _id: req.params.id,
    }).exec();
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
