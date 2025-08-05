const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
app.use(cors());


const todoRoutes = require("./routes/todo");
const { todos } = require("./routes/todo");

app.use(express.json());
app.use("/todos", todoRoutes);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});