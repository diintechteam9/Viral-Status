import React, { useState, useEffect } from 'react';
import {
  FaChartBar,
  FaBuilding,
  FaFileInvoiceDollar,
  FaChartLine,
  FaHeadset,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHistory,
  FaQuestionCircle,
  FaFileAlt,
  FaUserCircle,
  FaPhotoVideo,
  FaVideo,
  FaAngleLeft,
  FaImage,
  FaTrash,
  FaDownload,
  FaFolderPlus
} from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const ClientDashboard = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile and handle resize events
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const navItems = [
    { name: "Overview", icon: <FaChartBar /> },
    { name: "Business Profile", icon: <FaBuilding /> },
    { name: "Gallery", icon: <FaPhotoVideo /> },
    { name: "Reels", icon: <FaVideo /> },
    { name: "Tax Information", icon: <FaFileAlt /> },
    { name: "History", icon: <FaHistory /> },
    { name: "Support", icon: <FaHeadset /> },
    { name: "Help", icon: <FaQuestionCircle /> },
    { name: "Settings", icon: <FaCog />, subItems: ["Log out"] },
  ];

  const GalleryTab = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [currentFolder, setCurrentFolder] = useState('gallery');
    const [folders, setFolders] = useState(['gallery', 'KashiAI']);
    const [showAddImageModal, setShowAddImageModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [imageFormData, setImageFormData] = useState({
      title: '',
      description: '',
      file: null,
      preview: null
    });

    const userId = localStorage.getItem('userId');

    const fetchFiles = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        
        if (!userId || !token) {
          console.error('Missing authentication:', { userId, token: !!token });
          setError('Authentication required. Please log in again.');
          return;
        }
        
        console.log('Fetching files with data:', { 
          userId, 
          folderName: currentFolder,
          token: token.substring(0, 10) + '...' // Log partial token for security
        });
        
        const response = await axios.post(
          `${API_BASE_URL}/api/datastore/list-files`,
          {
            userId,
            folderName: currentFolder
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        console.log('Raw MongoDB Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        });
        
        if (!response.data) {
          console.error('Empty response data');
          setError('Server returned empty response');
          return;
        }

        if (!response.data.files) {
          console.error('Invalid response format:', response.data);
          setError('Invalid response format from server');
          return;
        }

        if (response.data.files.length === 0) {
          console.log('No files found in MongoDB for folder:', {
            userId,
            folderName: currentFolder,
            originalFolderName: currentFolder
          });
          setFiles([]);
          return;
        }
        
        // For each file, get a temporary download URL
        const filesWithUrls = await Promise.all(
          response.data.files.map(async (file) => {
            try {
              console.log('Processing file:', {
                fileName: file.fileName,
                folderName: currentFolder,
                userId
              });

              const downloadResponse = await axios.post(
                `${API_BASE_URL}/api/datastore/get-download-url`,
                {
                  fileName: file.fileName,
                  folderName: currentFolder,
                  userId
                },
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              
              console.log('Download URL response:', {
                status: downloadResponse.status,
                data: downloadResponse.data
              });
              
              if (!downloadResponse.data || !downloadResponse.data.url) {
                console.error('Invalid download URL response:', downloadResponse.data);
                return {
                  ...file,
                  fileUrl: null,
                  error: 'Invalid download URL response'
                };
              }
              
              const fileWithUrl = {
                ...file,
                fileUrl: downloadResponse.data.url
              };
              console.log('File with URL:', {
                fileName: fileWithUrl.fileName,
                hasUrl: !!fileWithUrl.fileUrl
              });
              return fileWithUrl;
            } catch (err) {
              console.error('Error getting download URL for file:', {
                fileName: file.fileName,
                error: err.message,
                response: err.response?.data,
                status: err.response?.status
              });
              return {
                ...file,
                fileUrl: null,
                error: `Failed to get download URL: ${err.message}`
              };
            }
          })
        );
        
        console.log('Final processed files:', {
          count: filesWithUrls.length,
          filesWithErrors: filesWithUrls.filter(f => f.error).length,
          filesWithUrls: filesWithUrls.filter(f => f.fileUrl).length
        });
        setFiles(filesWithUrls);
      } catch (err) {
        console.error('Error fetching files:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          stack: err.stack
        });
        setError(`Failed to fetch files: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Call fetchFiles when currentFolder changes
    useEffect(() => {
      console.log('Current folder changed to:', currentFolder);
      fetchFiles();
    }, [currentFolder]);

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          setError('Invalid file type. Please select a JPG, JPEG, PNG, or GIF file.');
          return;
        }
        setSelectedFile(file);
      }
    };

    const handleUpload = async () => {
      if (!selectedFile) return;

      try {
        setUploading(true);
        setError('');

        console.log('Starting upload process for file:', {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size
        });

        // 1. Get upload URL
        const uploadUrlResponse = await axios.post(`${API_BASE_URL}/api/datastore/get-upload-url`, {
          fileName: selectedFile.name,
          folderName: currentFolder,
          userId,
          type: 'Image',
          title: selectedFile.name,
          description: '',
          fileSize: selectedFile.size,
          mimeType: selectedFile.type
        });

        console.log('Received upload URL response:', uploadUrlResponse.data);

        if (!uploadUrlResponse.data.url) {
          throw new Error('No upload URL received from server');
        }

        // 2. Upload to S3 using Fetch API with minimal headers
        const uploadResponse = await fetch(uploadUrlResponse.data.url, {
          method: 'PUT',
          body: selectedFile,
          headers: {
            'Content-Type': selectedFile.type
          }
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Upload failed:', {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
            errorText: errorText
          });
          throw new Error(`Upload failed with status: ${uploadResponse.status}, ${errorText}`);
        }

        console.log('Upload completed successfully');

        // 3. Refresh file list
        await fetchFiles();
        setSelectedFile(null);
      } catch (err) {
        console.error('Upload error:', err);
        setError('Failed to upload file');
      } finally {
        setUploading(false);
      }
    };

    const handleDelete = async (fileName) => {
      try {
        // First delete from S3
        await axios.post(`${API_BASE_URL}/api/datastore/delete-file`, {
          fileName,
          folderName: currentFolder,
          userId
        });

        // Then delete from MongoDB
        await axios.post(`${API_BASE_URL}/api/datastore/delete-file-metadata`, {
          fileName,
          folderName: currentFolder,
          userId
        });

        // Refresh the file list
        await fetchFiles();
        setShowDeleteModal(false);
        setFileToDelete(null);
      } catch (err) {
        setError('Failed to delete file');
        console.error('Delete error:', err);
      }
    };

    const confirmDelete = (fileName) => {
      setFileToDelete(fileName);
      setShowDeleteModal(true);
    };

    const handleDownload = async (fileName) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/datastore/get-download-url`, {
          fileName,
          folderName: currentFolder,
          userId
        });
        window.open(response.data.url, '_blank');
      } catch (err) {
        setError('Failed to get download URL');
        console.error('Download error:', err);
      }
    };

    const handleCreateFolder = async () => {
      if (!newFolderName.trim()) {
        setError('Please enter a folder name');
        return;
      }

      try {
        // Add the new folder to the list immediately
        const newFolders = [...folders, newFolderName];
        console.log('Adding new folder:', newFolderName);
        console.log('Updated folders list:', newFolders);
        setFolders(newFolders);
        setShowNewFolderModal(false);
        setNewFolderName('');
        setCurrentFolder(newFolderName);
      } catch (err) {
        setError('Failed to create folder');
        console.error('Create folder error:', err);
      }
    };

    const handleImageFormChange = (e) => {
      const { name, value } = e.target;
      setImageFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleImageFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          setError('Invalid file type. Please select a JPG, JPEG, PNG, or GIF file.');
          return;
        }
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImageFormData(prev => ({
          ...prev,
          file,
          preview: previewUrl
        }));
      }
    };

    const handleImageUpload = async () => {
      if (!imageFormData.file) {
        setError('Please select an image file');
        return;
      }

      try {
        setUploading(true);
        setError('');

        // 1. Get upload URL
        const uploadUrlResponse = await axios.post(`${API_BASE_URL}/api/datastore/get-upload-url`, {
          fileName: imageFormData.file.name,
          folderName: currentFolder,
          userId,
          type: 'Image',
          title: imageFormData.title || imageFormData.file.name,
          description: imageFormData.description,
          fileSize: imageFormData.file.size,
          mimeType: imageFormData.file.type
        });

        if (!uploadUrlResponse.data.url) {
          throw new Error('No upload URL received from server');
        }

        // 2. Upload to S3
        const uploadResponse = await fetch(uploadUrlResponse.data.url, {
          method: 'PUT',
          body: imageFormData.file,
          headers: {
            'Content-Type': imageFormData.file.type
          }
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status: ${uploadResponse.status}`);
        }

        // 3. Refresh file list and close modal
        await fetchFiles();
        setShowAddImageModal(false);
        setImageFormData({
          title: '',
          description: '',
          file: null,
          preview: null
        });
      } catch (err) {
        console.error('Upload error:', err);
        setError('Failed to upload image');
      } finally {
        setUploading(false);
      }
    };

    // Add this to debug folder state changes
    useEffect(() => {
      console.log('Current folders:', folders);
    }, [folders]);

    return (
      <div className="p-2 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <select
              value={currentFolder}
              onChange={(e) => setCurrentFolder(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 sm:px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAddImageModal(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <FaImage /> Add Image
            </button>
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <FaFolderPlus /> New Folder
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Image Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {files.map((file) => (
              <div 
                key={file.fileName} 
                className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative bg-gray-100 w-full h-64 flex items-center justify-center">
                  <img
                    src={file.fileUrl}
                    alt={file.title}
                    className="w-64 h-full object-fill p-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      // Use a base64-encoded SVG as fallback
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBsb2FkIGVycm9yPC90ZXh0Pjwvc3ZnPg==';
                      console.error('Image load error:', {
                        fileName: file.fileName,
                        fileUrl: file.fileUrl
                      });
                    }}
                  />
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(file.fileName)}
                        className="p-2 bg-white text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
                        title="Download"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => confirmDelete(file.fileName)}
                        className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
                {/* File Info */}
                <div className="p-3 sm:p-4 flex-grow flex flex-col">
                  <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base" title={file.title}>
                    {file.title}
                  </h3>

                  <p className="font-semibold text-gray-800 truncate text-sm sm:text-base" title={file.title}>
                    {file.description}
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-auto pt-2">
                    {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Date not available'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Image Modal */}
        {showAddImageModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white p-4 shadow-2xl sm:p-6 rounded-lg w-full max-w-2xl mx-auto my-8 relative">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Add New Image</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Preview */}
                <div className="flex flex-col items-center justify-center">
                  {imageFormData.preview ? (
                    <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={imageFormData.preview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaImage className="text-gray-400 text-4xl" />
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleImageFileSelect}
                    accept="image/jpg,image/jpeg,image/png,image/gif"
                    className='mt-4 flex border-1 p-1 justify-center items-center rounded-2xl'
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={imageFormData.title}
                      onChange={handleImageFormChange}
                      placeholder="Enter image title"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={imageFormData.description}
                      onChange={handleImageFormChange}
                      placeholder="Enter image description"
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowAddImageModal(false);
                    setImageFormData({
                      title: '',
                      description: '',
                      file: null,
                      preview: null
                    });
                  }}
                  className="px-3 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageUpload}
                  disabled={uploading || !imageFormData.file}
                  className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Folder Modal */}
        {showNewFolderModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white p-4 sm:p-6 shadow-2xl rounded-lg w-full max-w-sm mx-auto my-8 relative">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Create New Folder</h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-3 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white p-4 sm:p-6 shadow-2xl rounded-lg w-full max-w-sm mx-auto my-8 relative">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this file? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setFileToDelete(null);
                  }}
                  className="px-3 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(fileToDelete)}
                  className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-100">
       {/* Overlay for mobile when sidebar is open */}
       {isMobile && isSidebarOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full opacity-50 z-40 bg-black"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ease-in-out ${
          isMobile
            ? isSidebarOpen
              ? "w-64 translate-x-0"
              : "-translate-x-full w-64"
            : isSidebarOpen
            ? "w-64"
            : "w-20"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          {isSidebarOpen && (
            <h4 className="m-0 font-semibold text-lg truncate">Client Dashboard</h4>
          )}
          <button
            className="text-black hover:text-gray-700 focus:outline-none"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaAngleLeft size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        <div
          className="flex flex-col mt-3 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 60px)" }}
        >
          {navItems.map((item, index) => (
            <div key={index}>
              <button
                className={`flex items-center w-full py-3 px-4 text-left hover:bg-gray-100 ${
                  activeTab === item.name
                    ? "bg-green-500 text-white"
                    : "text-black"
                }`}
                onClick={() => handleTabClick(item.name)}
              >
                <span className="mr-3 text-xl flex-shrink-0">{item.icon}</span>
                {(isSidebarOpen || isMobile) && (
                  <span className="truncate">{item.name}</span>
                )}
              </button>

              {/* Dropdown for Settings */}
              {isSidebarOpen && item.subItems && activeTab === item.name && (
                <div className="ml-8 mt-1 mb-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      className="flex items-center w-full py-2 text-left hover:bg-gray-100 text-black"
                      onClick={() => {
                        if (subItem === "Log out") onLogout();
                      }}
                    >
                      {subItem === "Log out" && (
                        <FaSignOutAlt className="mr-2 flex-shrink-0" />
                      )}
                      <span className="truncate">{subItem}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        className={`${
          isMobile ? "ml-0" : isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Mobile header with toggle button */}
        {isMobile && (
          <div className="flex justify-between items-center p-4 bg-white shadow-sm">
            <button
              className="p-2 bg-gray-800 text-white rounded-md"
              onClick={toggleSidebar}
            >
              <FaBars />
            </button>
            <h4 className="m-0 font-bold">Client Dashboard</h4>
          </div>
        )}

        <main className="container mx-auto p-2 sm:p-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{activeTab}</h2>
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 mt-4">
            
            {activeTab === "Overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-base sm:text-lg mb-2">Business Profile</h3>
                  <p className="text-sm sm:text-base">View and update your business information</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-base sm:text-lg mb-2">Transactions</h3>
                  <p className="text-sm sm:text-base">Manage and view transaction history</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-base sm:text-lg mb-2">Reports</h3>
                  <p className="text-sm sm:text-base">Generate and download business reports</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-base sm:text-lg mb-2">Tax Information</h3>
                  <p className="text-sm sm:text-base">Manage GST, PAN, and other tax details</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-base sm:text-lg mb-2">Support</h3>
                  <p className="text-sm sm:text-base">Contact support and view help resources</p>
                </div>
              </div>
            )}

            {activeTab === "Business Profile" && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Business Name</p>
                      <p className="font-semibold text-sm sm:text-base truncate">{user.businessName}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">GST Number</p>
                      <p className="font-semibold text-sm sm:text-base truncate">{user.gstNo}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">PAN Number</p>
                      <p className="font-semibold text-sm sm:text-base truncate">{user.panNo}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">City</p>
                      <p className="font-semibold text-sm sm:text-base truncate">{user.city}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Pincode</p>
                      <p className="font-semibold text-sm sm:text-base truncate">{user.pincode}</p>
                    </div>
                    {user.websiteUrl && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Website</p>
                        <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm sm:text-base truncate block">
                          {user.websiteUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Transactions" && (
              <div className="space-y-4">
                <p>Transaction history and management will go here</p>
              </div>
            )}

            {activeTab === "Reports" && (
              <div className="space-y-4">
                <p>Business reports and analytics will go here</p>
              </div>
            )}

            {activeTab === "Tax Information" && (
              <div className="space-y-4">
                <p>Tax details and management will go here</p>
              </div>
            )}

            {activeTab === "History" && (
              <div className="space-y-4">
                <p>Activity history will go here</p>
              </div>
            )}

            {activeTab === "Support" && (
              <div className="space-y-4">
                <p>Support and help resources will go here</p>
              </div>
            )}

            {activeTab === "Help" && (
              <div className="space-y-4">
                <p>Help documentation and guides will go here</p>
              </div>
            )}

            {activeTab === "Settings" && (
              <div className="space-y-4">
                <p>Account settings and preferences will go here</p>
              </div>
            )}

            {activeTab === "Gallery" && (
              <GalleryTab />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard; 