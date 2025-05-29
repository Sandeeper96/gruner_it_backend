const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const employeeRoutes = require("./routes/employees");
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});
console.log("employeeRoutes",employeeRoutes);

// app.use('/api/employees', require('./routes/employees'));
app.use("/api/employees", employeeRoutes);
app.use('/api/inventory', require('./routes/inventory'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
