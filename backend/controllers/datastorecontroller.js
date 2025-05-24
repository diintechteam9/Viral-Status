const {
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3, BUCKET_NAME } = require("../config/s3");
const Datastore = require("../models/datastore");

// Create Folder
const createFolder = async (req, res) => {
    const { folderName, userId } = req.body;
    if (!folderName || !userId) return res.status(400).json({ error: "Missing fields" });

    const key = `${userId}/${folderName}/.keep`;
    const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key, Body: '' });

    try {
        await s3.send(command);
        res.json({ message: "Folder created successfully" });
    } catch (err) {
        console.error("CREATE FOLDER ERROR:", err);
        res.status(500).json({ error: "Folder creation failed" });
    }
};

// Get Upload URL
const getUploadUrl = async (req, res) => {
    try {
        console.log('Received upload request with body:', req.body);
        const { fileName, folderName, userId, type, title, description, fileSize, mimeType } = req.body;
        
        // Validate required fields
        if (!fileName || !folderName || !userId) {
            console.log('Missing required fields:', { fileName, folderName, userId });
            return res.status(400).json({ 
                error: "Missing required fields",
                details: { fileName, folderName, userId }
            });
        }

        // Validate file type
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const detectedMimeType = `image/${fileExtension}`;
        
        console.log('File type validation:', {
            fileName,
            mimeType,
            detectedMimeType,
            allowedTypes
        });

        if (!allowedTypes.includes(detectedMimeType)) {
            console.log('Invalid file type detected');
            return res.status(400).json({ 
                error: "Invalid file type",
                details: { fileName, mimeType: detectedMimeType }
            });
        }

        const key = `${userId}/${folderName}/${fileName}`;
        console.log('Generating upload URL for:', { 
            key, 
            bucket: BUCKET_NAME,
            contentType: detectedMimeType
        });

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: detectedMimeType,
            ACL: 'private'
        });

        console.log('S3 command created:', command);

        const url = await getSignedUrl(s3, command, { 
            expiresIn: 3600,
            signableHeaders: new Set(['host', 'content-type'])
        });
        
        console.log('Generated signed URL successfully');
        
        // Create datastore entry
        const datastoreData = {
            type: type || 'Image',
            title: title || fileName,
            description: description || '',
            fileUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
            fileName: fileName,
            fileSize: fileSize || 0,
            mimeType: detectedMimeType,
            metadata: {
                userId,
                folderName,
                key,
                mimeType: detectedMimeType
            }
        };

        console.log('Creating datastore entry with data:', datastoreData);

        const datastore = await Datastore.create(datastoreData);
        console.log('Successfully created datastore entry:', datastore._id);

        res.json({ 
            url,
            datastoreId: datastore._id,
            key
        });
    } catch (err) {
        console.error("UPLOAD URL ERROR:", {
            message: err.message,
            stack: err.stack,
            name: err.name
        });
        res.status(500).json({ 
            error: "Failed to generate upload URL",
            details: err.message
        });
    }
};

// List Files
const listFiles = async (req, res) => {
    try {
        const { userId, folderName } = req.body;
        if (!userId || !folderName) {
            return res.status(400).json({ 
                error: "Missing required fields",
                details: { userId, folderName }
            });
        }

        console.log('Listing files for:', { userId, folderName });

        // Get files from MongoDB first
        const datastoreEntries = await Datastore.find({
            'metadata.userId': userId,
            'metadata.folderName': folderName
        });

        console.log('MongoDB Query:', {
            'metadata.userId': userId,
            'metadata.folderName': folderName
        });
        console.log('Found MongoDB entries:', datastoreEntries.length);
        console.log('MongoDB entries:', JSON.stringify(datastoreEntries, null, 2));

        // If no entries in MongoDB, return empty array
        if (!datastoreEntries || datastoreEntries.length === 0) {
            console.log('No entries found in MongoDB');
            return res.status(200).json({ files: [] });
        }

        // Map MongoDB entries to the expected format
        const filesWithMetadata = datastoreEntries.map(entry => ({
            fileName: entry.fileName,
            id: entry._id,
            type: entry.type,
            title: entry.title,
            description: entry.description,
            fileUrl: entry.fileUrl,
            createdAt: entry.createdAt
        }));

        console.log('Processed files:', JSON.stringify(filesWithMetadata, null, 2));

        res.status(200).json({ files: filesWithMetadata });
    } catch (err) {
        console.error("LIST FILES ERROR:", err);
        res.status(500).json({ 
            error: "Failed to list files",
            details: err.message
        });
    }
};

// Get Download URL
const getDownloadUrl = async (req, res) => {
    try {
        const { fileName, folderName, userId } = req.body;
        if (!fileName || !folderName || !userId) {
            return res.status(400).json({ 
                error: "Missing required fields",
                details: { fileName, folderName, userId }
            });
        }

        const key = `${userId}/${folderName}/${fileName}`;
        console.log('Generating download URL for:', key);

        const command = new GetObjectCommand({ 
            Bucket: BUCKET_NAME, 
            Key: key 
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour expiry
        res.json({ url });
    } catch (err) {
        console.error("DOWNLOAD URL ERROR:", err);
        res.status(500).json({ 
            error: "Failed to generate download URL",
            details: err.message
        });
    }
};

// Delete File
const deleteFile = async (req, res) => {
    try {
        const { fileName, folderName, userId } = req.body;
        if (!fileName || !folderName || !userId) {
            return res.status(400).json({ 
                error: "Missing required fields",
                details: { fileName, folderName, userId }
            });
        }

        const key = `${userId}/${folderName}/${fileName}`;
        console.log('Deleting file:', key);

        const command = new DeleteObjectCommand({ 
            Bucket: BUCKET_NAME, 
            Key: key 
        });

        await s3.send(command);
        
        // Delete from datastore
        await Datastore.findOneAndDelete({
            'metadata.userId': userId,
            'metadata.folderName': folderName,
            fileName: fileName
        });

        res.json({ message: "File deleted successfully" });
    } catch (err) {
        console.error("DELETE FILE ERROR:", err);
        res.status(500).json({ 
            error: "File deletion failed",
            details: err.message
        });
    }
};

module.exports = {
    createFolder,
    getUploadUrl,
    listFiles,
    getDownloadUrl,
    deleteFile
}; 