const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const { sendCreateBatch, createCampaign, getMyLastCampaign } = require("./efx");

const app = express();
app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors({ origin: "*" }));
app.use(express.static("public"));

var upload = multer({ dest: "tmp/upload/" });

// const handler = (func, params, res) => {
//   console.log(params);
//   func(params)
//     .then((data) => res.send(data))
//     .catch((err) => {
//       console.log(err);
//       res.send(err);
//     });
// };

// app.post(
//   '/createBatch',
//   upload.single('imageFile'),
//   async (req, res) => {
//     console.log(req.body)
//     if (req.imageFile) {
//       await readFile(imageFile.path);
//     }

//     // res.send({data:req.body, file:req.file})
//     res.send("ok")
//   },
// );

app.get("/getMyLastCampaign", (req, res) => {
  getMyLastCampaign()
    .then((data) => res.send(data))
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.get("/createCampaign", (req, res) => {
  createCampaign()
    .then((data) => res.send(data))
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.post("/createBatch", (req, res) => {
  sendCreateBatch(req.body)
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
  // setTimeout(() => res.send('waiting'), 5000);
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../", "public", "index.html"));
});

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server started (http://localhost:${port})!`);
});
