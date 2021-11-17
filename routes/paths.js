const express = require("express");
const router = express.Router();
const Path = require("../models/paths.model");
const AuditLog = require("../models/logs.model");
const { Children, State } = require("../controller/controller");
const Node = require("../models/nodes.model");

router.get("/", async (req, res, next) => {
  try {
    const paths = await Path.find().exec();
    res.send(paths);
  } catch (err) {
    res.status(err.code).send(err.message);
  }
});

router.get("/:pathID", async (req, res) => {
  try {
    const path = await Path.findOne({ _id: req.params.pathID }).exec();
    res.send(path);
  } catch (err) {
    res.status(err.code).send(err.message);
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const path = new Path({
    name: name,
  });
  await path.save((err) => (err ? res.send(err) : res.send(path)));
  let auditlog = new AuditLog({
    source: req.headers["user-agent"],
    HTTPmethod: req.method,
    status: path.status,
    result: res.statusCode,
    resultDetail: res.statusMessage,
    response: path._id,
  });
  await auditlog.save();
  console.log(auditlog);
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, position } = req.body;
    const state = await State(req.params.id);
    const numChildren = await Children(req.params.id);
    Path.updateOne(
      { _id: req.params.id },
      {
        name: name,
        state: state,
        numChildren: numChildren,
        position: position,
      },
      { upsert: true }
    ).exec();
    let auditlog = new AuditLog({
      source: req.headers["user-agent"],
      HTTPmethod: req.method,
      pathID: req.params.id,
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
    const deletedpath = await Path.findOneAndDelete({
      _id: req.params.id,
    }).exec();
    res.status(200).send("delete successful");
    let auditlog = new AuditLog({
      source: req.headers["user-agent"],
      HTTPmethod: req.method,
      pathID: deletedpath._id,
      status: deletedpath.status,
      result: res.statusCode,
      resultDetail: res.statusMessage,
    });
    await auditlog.save();
  } catch (err) {
    res.send(err.code).send(err.message);
  }
});

module.exports = router;
