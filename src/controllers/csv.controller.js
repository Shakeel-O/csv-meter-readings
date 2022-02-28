const db = require("../models");
const Account = db.accounts;
const Reading = db.readings;
const fs = require("fs");
const csv = require("fast-csv");

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      console.log(req);

      return res.status(400).send("Please upload your Accounts csv file");
    }
    let accounts = [];
    let path = __basedir + "/resources/assets/" + req.file.filename;

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        accounts.push(row);
      })
      .on("end", () => {
        Account.bulkCreate(accounts)
          .then(() => {
            res.status(200).send({
              message:
                "Uploaded the file successfully: " + req.file.originalname,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Fail to import data into database!",
              error: error.message,
            });
          });
      });
  } catch (error) {
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const meterUpload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload your meter readings csv file");
    }

    let readings = [];
    let failed = [];
    let path = __basedir + "/resources/assets/" + req.file.filename;


    let successCount = 0;
    let failedCount = 0;

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data",  (row) => {
        let valid = true;

        //checks for duplicate entries
        const duplicate = readings.some(reading => Object.entries(reading).toString() === Object.entries(row).toString())

        // 4 digit validation
        if (!row.account_id || !(row.reading <= 9999 && row.reading >= 1000) || duplicate)
        {
          failedCount++
          failed.push(row);
          return;
        }

        //Validate against id
        let account = Account.findOne({
          where:            
              { account_id: row.account_id }
              
        }).then(item => {
          if (!item)
          {
            return false
          }
          else
          {
            return true
          }
        })
        valid = account.then(i => i)

        if (valid) {
          readings.push(row);
          successCount++;
        }
        else {
          failedCount++
          failed.push(row);
        }
      })
      .on("end", () => {
        //add valid entries to DB
        Reading.bulkCreate(readings)
          .then(() => {
            res.status(200).send({
              message:
                "Success: " + readings.length + " Failed: " + failed.length,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Failed to import",
              error: error.message,
            });
          });
      });
  } catch (error) {
    res.status(500).send({
      message: "failed to upload: " + req.file.originalname,
    });
  }
};

const getAccounts = (req, res) => {
  Account.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message,
      });
    });
};

const getReadings = (req, res) => {
  Reading.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message,
      });
    });
};

module.exports = {
  upload,
  meterUpload,
  getAccounts,
  getReadings
};
