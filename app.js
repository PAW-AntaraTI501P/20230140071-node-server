// app.js (atau server.js)
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const db = require("./database/db");
const port = process.env.PORT || 3001;
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");

// Impor Rute & Middleware
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const authMiddleware = require("./middleware/auth");

// Middleware Global
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);

// Konfigurasi View Engine
app.set("view engine", "ejs");
app.set("layout", "layouts/main-layouts");

// Hubungkan Rute API
app.use("/api/auth", authRoutes); // Rute otentikasi tidak memerlukan middleware
app.use("/api/todos", authMiddleware, todoRoutes); // Rute todo dilindungi oleh middleware

// Routing Halaman EJS
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// Middleware 404
app.use((req, res) => {
  res.status(404).send("404 - page not found");
});

// Jalankan Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});