const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Client = require("../models/client");

// Generate JWT Token for admin
const generateAdminToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, admincode } = req.body;

    if (admincode != process.env.ADMIN_REGISTRATION_CODE) {
      console.log(admincode, process.env.ADMIN_REGISTRATION_CODE);
      return res.status(401).json({ message: "Invalid admin code" });
    }

    const existingadmin = await Admin.findOne({ email });
    if (existingadmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ name, email, password: hashpassword });

    const token = generateAdminToken(admin._id);

    res.status(201).json({
      success: true,
      token,
      admin,
    });

    console.log("Admin registered successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Admin registration failed");
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    const ispasswordvalid = await bcrypt.compare(password, admin.password);

    if (!ispasswordvalid) {
      return res.status(401).json({ meassage: "invalid credentials" });
    }

    if (!admin) {
      return res.status(401).json({ message: "admin not found" });
    }

    const token = generateAdminToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      admin,
    });

    console.log("admin login successfully");
  } catch (error) {
    console.log("login failed");
  }
};

const getClients = async (req, res) => {
    try {
      const clients = await Client.find().select('-password');
      
      res.status(200).json({
        success: true,
        count: clients.length,
        data: clients
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Get client profile by ID
  const getClientById = async (req, res) => {
    try {
      const client = await Client.findById(req.params.id).select('-password');
      
      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: client
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

module.exports = {
  registerAdmin,
  loginAdmin,
  getClients,
  getClientById
};
