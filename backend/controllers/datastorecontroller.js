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
            const missingFields = [];
            if (!fileName) missingFields.push('file name');
            if (!folderName) missingFields.push('folder name');
            if (!userId) missingFields.push('user ID');
            
            return res.status(400).json({ 
                error: "Missing required information",
                message: `Please provide: ${missingFields.join(', ')}`,
                details: { fileName, folderName, userId }
            });
        }

        // Validate file type
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const detectedMimeType = `image/${fileExtension}`;
        
        if (!allowedTypes.includes(detectedMimeType)) {
            return res.status(400).json({ 
                error: "Invalid file type",
                message: `Only ${allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} files are allowed`,
                details: { 
                    fileName, 
                    detectedType: detectedMimeType,
                    allowedTypes 
                }
            });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (fileSize > maxSize) {
            return res.status(400).json({
                error: "File too large",
                message: "Maximum file size is 5MB",
                details: {
                    fileSize,
                    maxSize,
                    sizeInMB: (fileSize / (1024 * 1024)).toFixed(2)
                }
            });
        }

        const key = `${userId}/${folderName}/${fileName}`;
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: detectedMimeType,
            ACL: 'private'
        });

        const url = await getSignedUrl(s3, command, { 
            expiresIn: 3600,
            signableHeaders: new Set(['host', 'content-type'])
        });
        
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

        const datastore = await Datastore.create(datastoreData);

        res.json({ 
            url,
            datastoreId: datastore._id,
            key,
            message: "Upload URL generated successfully"
        });
    } catch (err) {
        console.error("UPLOAD URL ERROR:", {
            message: err.message,
            stack: err.stack,
            name: err.name
        });
        
        let errorMessage = "Failed to generate upload URL";
        if (err.name === 'AccessDenied') {
            errorMessage = "Access denied to storage service";
        } else if (err.name === 'NoSuchBucket') {
            errorMessage = "Storage service configuration error";
        }
        
        res.status(500).json({ 
            error: errorMessage,
            message: "Please try again or contact support if the problem persists",
            details: err.message
        });
    }
};

// List Files
const listFiles = async (req, res) => {
    try {
        const { userId, folderName } = req.body;
        if (!userId || !folderName) {
            const missingFields = [];
            if (!userId) missingFields.push('user ID');
            if (!folderName) missingFields.push('folder name');
            
            return res.status(400).json({ 
                error: "Missing required information",
                message: `Please provide: ${missingFields.join(', ')}`,
                details: { userId, folderName }
            });
        }

        const query = {
            'metadata.userId': userId,
            'metadata.folderName': folderName
        };
        
        const datastoreEntries = await Datastore.find(query);
        
        if (!datastoreEntries || datastoreEntries.length === 0) {
            return res.status(200).json({ 
                files: [],
                message: "No files found in this folder"
            });
        }

        const filesWithMetadata = datastoreEntries.map(entry => ({
            fileName: entry.fileName,
            id: entry._id,
            type: entry.type,
            title: entry.title,
            description: entry.description,
            fileUrl: entry.fileUrl,
            createdAt: entry.createdAt
        }));

        res.status(200).json({ 
            files: filesWithMetadata,
            message: `Found ${filesWithMetadata.length} file(s)`,
            count: filesWithMetadata.length
        });
    } catch (err) {
        console.error("LIST FILES ERROR:", err);
        
        let errorMessage = "Failed to list files";
        if (err.name === 'CastError') {
            errorMessage = "Invalid user ID format";
        }
        
        res.status(500).json({ 
            error: errorMessage,
            message: "Please try again or contact support if the problem persists",
            details: err.message
        });
    }
};

// Get Download URL
const getDownloadUrl = async (req, res) => {
    try {
        const { fileName, folderName, userId } = req.body;
        if (!fileName || !folderName || !userId) {
            const missingFields = [];
            if (!fileName) missingFields.push('file name');
            if (!folderName) missingFields.push('folder name');
            if (!userId) missingFields.push('user ID');
            
            return res.status(400).json({ 
                error: "Missing required information",
                message: `Please provide: ${missingFields.join(', ')}`,
                details: { fileName, folderName, userId }
            });
        }

        const key = `${userId}/${folderName}/${fileName}`;
        const command = new GetObjectCommand({ 
            Bucket: BUCKET_NAME, 
            Key: key 
        });

        const url = await getSignedUrl(s3, command, { 
            expiresIn: 3600,
            signableHeaders: new Set(['host']),
            unhoistableHeaders: new Set(['host'])
        });

        res.json({ 
            url,
            message: "Download URL generated successfully",
            expiresIn: "1 hour"
        });
    } catch (err) {
        console.error("DOWNLOAD URL ERROR:", err);
        
        let errorMessage = "Failed to generate download URL";
        if (err.name === 'NoSuchKey') {
            errorMessage = "File not found in storage";
        } else if (err.name === 'AccessDenied') {
            errorMessage = "Access denied to file";
        }
        
        res.status(500).json({ 
            error: errorMessage,
            message: "Please try again or contact support if the problem persists",
            details: err.message
        });
    }
};

// Delete File
const deleteFile = async (req, res) => {
    try {
        const { fileName, folderName, userId } = req.body;
        if (!fileName || !folderName || !userId) {
            const missingFields = [];
            if (!fileName) missingFields.push('file name');
            if (!folderName) missingFields.push('folder name');
            if (!userId) missingFields.push('user ID');
            
            return res.status(400).json({ 
                error: "Missing required information",
                message: `Please provide: ${missingFields.join(', ')}`,
                details: { fileName, folderName, userId }
            });
        }

        const key = `${userId}/${folderName}/${fileName}`;
        
        // First delete from S3
        const command = new DeleteObjectCommand({ 
            Bucket: BUCKET_NAME, 
            Key: key 
        });

        await s3.send(command);
        
        // Then delete from MongoDB
        const deleteResult = await Datastore.findOneAndDelete({
            'metadata.userId': userId,
            'metadata.folderName': folderName,
            'fileName': fileName
        });

        if (!deleteResult) {
            return res.status(404).json({
                error: "File not found",
                message: "The file was not found in the database",
                details: {
                    fileName,
                    folderName,
                    userId
                }
            });
        }

        res.json({ 
            message: "File deleted successfully",
            details: {
                deletedFromS3: true,
                deletedFromMongoDB: true,
                fileName,
                folderName
            }
        });
    } catch (err) {
        console.error("DELETE FILE ERROR:", {
            message: err.message,
            stack: err.stack,
            name: err.name
        });
        
        let errorMessage = "Failed to delete file";
        if (err.name === 'NoSuchKey') {
            errorMessage = "File not found in storage";
        } else if (err.name === 'AccessDenied') {
            errorMessage = "Access denied to delete file";
        }
        
        res.status(500).json({ 
            error: errorMessage,
            message: "Please try again or contact support if the problem persists",
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