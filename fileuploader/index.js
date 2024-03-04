require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const AWS = require("aws-sdk");
const cors = require("cors");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");
const corsOptions = require("./config/corsOptions.config");

// Configure AWS SDK with your credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const extensionSplits = file.originalname.split(".");
            const ext = extensionSplits[extensionSplits.length - 1];
            cb(null, `${uuidv4(24)}.${ext}`);
        },
    }),
});

app.post("/upload", cors(corsOptions), upload.single("cover"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded",
        });
    }
    // Send response
    res.status(200).json({
        success: true,
        message: "File uploaded",
        filename: req.file.key,
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

app.get("/", cors(), (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
