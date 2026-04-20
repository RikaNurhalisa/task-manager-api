const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());

/* HALAMAN UTAMA */
app.get("/", (req, res) => {
  res.send(`
    <center>
      <h1>Nama : Rika Nurhalisa</h1>
      <h2>NIM : 23552011102</h2>
      <h2 style="color:green;">UTS PEMOGRAMAN WEB BERHASIL</h2>
    </center>
  `);
});

/* MIDDLEWARE LOGGING */
app.use((req, res, next) => {
  const waktu = new Date().toISOString();
  console.log(`[${waktu}] ${req.method} ${req.url}`);
  next();
});

/* GET ALL */
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET BY ID */
app.get("/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* CREATE */
app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title tidak boleh kosong" });
    }

    const result = await pool.query(
      "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE */
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description, is_completed } = req.body;

    const cek = await pool.query(
      "SELECT * FROM tasks WHERE id=$1",
      [req.params.id]
    );

    if (cek.rows.length === 0) {
      return res.status(404).json({ message: "Task tidak ditemukan" });
    }

    const result = await pool.query(
      `UPDATE tasks 
       SET title=$1, description=$2, is_completed=$3 
       WHERE id=$4 RETURNING *`,
      [title, description, is_completed, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE */
app.delete("/tasks/:id", async (req, res) => {
  try {
    const cek = await pool.query(
      "SELECT * FROM tasks WHERE id=$1",
      [req.params.id]
    );

    if (cek.rows.length === 0) {
      return res.status(404).json({ message: "Task tidak ditemukan" });
    }

    await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);

    res.json({ message: "Task berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* RUN SERVER */
app.listen(PORT, () => {
  console.log(`Server running di http://localhost:${PORT}`);
});