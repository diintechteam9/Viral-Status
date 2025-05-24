const express = require("express");
const { registerAdmin, loginAdmin, getClients, getClientById } = require("../controllers/admincontroller");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello admin");
});

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.get("/getclients", getClients);

router.get("/getclientbyid/:id", getClientById);


module.exports = router;
