const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const clientRoutes = require("./routes/clientroutes");
const adminRoutes = require("./routes/adminroutes");
const superadminRoutes = require("./routes/superadminroutes");
const datastoreRoutes = require("./routes/datastoreroutes");  

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: ["https://viral-status.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600
}));

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Hello World");
  });
  app.use('/api/client', clientRoutes);   
  app.use('/api/admin', adminRoutes);
  app.use('/api/superadmin',superadminRoutes);
  app.use('/api/datastore', datastoreRoutes);

connectDB().then(()=>{
    app.listen(PORT, () => {
    console.log("Server is running on port 4000");
});
})


