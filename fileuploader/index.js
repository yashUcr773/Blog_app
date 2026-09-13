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
const jwt = require('jsonwebtoken')

const requiredAwsEnv = [
    "AWS_ACCESS_KEY_ID",
    "AWS_ACCESS_SECRET",
    "AWS_REGION",
    "AWS_BUCKET",
];
const hasAwsConfig = requiredAwsEnv.every((key) => Boolean(process.env[key]));
let upload;

if (hasAwsConfig) {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
        region: process.env.AWS_REGION,
    });

    const s3 = new AWS.S3();

    upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.AWS_BUCKET,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                const extensionSplits = file.originalname.split(".");
                const ext = extensionSplits[extensionSplits.length - 1];
                cb(null, `${uuidv4()}.${ext}`);
            },
        }),
    });
} else {
    console.warn(
        `AWS upload disabled. Missing: ${requiredAwsEnv
            .filter((key) => !process.env[key])
            .join(", ")}`
    );
}

function requireUploadConfig(req, res, next) {
    if (!upload) {
        return res.status(503).json({
            success: false,
            message: "File upload service is not configured.",
        });
    }

    return next();
}

async function verifyJWT(req, res, next) {
    try {
        const authHeader =
            req.headers.authorization || req.headers.Authorization;


        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(403).json({
                success: false,
                message: "Authentication Error",
            });
        }

        const token = authHeader.split(' ')[1]
        const { userInfo } = await jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );


        return next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({
            success: false,
            message: "Auth Error",
        });
    }
}

app.post("/upload", cors(corsOptions), verifyJWT, requireUploadConfig, (req, res, next) => {
    upload.single("cover")(req, res, next);
}, (req, res) => {
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
        message: "Internal Server Error",
    });
});

app.get("/test", cors(corsOptions), (req, res) =>
    res.send("Blog app hosted on https://quickpost.dev")
);
app.get("/", cors(corsOptions), (req, res) => res.redirect("https://quickpost.dev"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
