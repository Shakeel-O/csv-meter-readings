const express = require("express");
const router = express.Router();
const csvController = require("../../../csv-meter-readings/src/controllers/csv.controller");
const upload = require("../../../csv-meter-readings/src/tools/upload");

let routes = (app) => {
  router.post("/meter-reading-uploads", upload.single('file'), csvController.meterUpload);
  router.post("/upload-account", upload.single('file'), csvController.upload);

  router.get("/getAccounts", csvController.getAccounts);
  router.get("/getReadings", csvController.getReadings);

  app.use(router);
};

module.exports = routes;
