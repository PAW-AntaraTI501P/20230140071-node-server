// routes/todo.js
const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Semua rute di bawah ini akan memerlukan token JWT yang valid
// Middleware auth akan menangani ini di file app.js
// Namun, jika Anda ingin melindunginya di sini, Anda bisa uncomment baris di bawah ini
// const authMiddleware = require("../middleware/auth");
// router.use(authMiddleware);

// GET semua todos
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM todos WHERE user_id = ?"; // Filter berdasarkan user
    const params = [req.user.id]; // Ambil user_id dari token

    if (search) {
      query += " AND task LIKE ?";
      params.push(`%${search}%`);
    }

    const [rows] = await db.query(query, params);
    res.json({ todos: rows });
  } catch (err) {
    console.error("Gagal mengambil data todo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST tambah todo baru
router.post("/", async (req, res) => {
  const { task } = req.body;
  const user_id = req.user.id; // Ambil user_id dari token

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO todos (task, completed, user_id) VALUES (?, ?, ?)",
      [task, false, user_id]
    );
    res.status(201).json({ id: result.insertId, task, completed: false, user_id });
  } catch (err) {
    console.error("Gagal menambahkan todo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update todo
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  const user_id = req.user.id;

  // ... (Logika pembuatan query tetap sama)
  try {
    const [result] = await db.query(query + " AND user_id = ?", [...params, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found or you don't have access" });
    }
    res.json({ message: "Todo updated successfully" });
  } catch (err) {
    console.error("Gagal memperbarui todo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE todo berdasarkan ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const [result] = await db.query("DELETE FROM todos WHERE id = ? AND user_id = ?", [id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found or you don't have access" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Gagal menghapus todo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;