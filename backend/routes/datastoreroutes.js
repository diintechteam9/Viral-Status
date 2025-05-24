const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
    createFolder,
    getUploadUrl,
    listFiles,
    getDownloadUrl,
    deleteFile
} = require("../controllers/datastorecontroller");

// Protected routes
router.use(protect);

// Create folder
router.post("/create-folder", createFolder);

// Get upload URL
router.post("/get-upload-url", getUploadUrl);

// List files
router.post("/list-files", listFiles);

// Get download URL
router.post("/get-download-url", getDownloadUrl);

// Delete file
router.post("/delete-file", deleteFile);

module.exports = router;
