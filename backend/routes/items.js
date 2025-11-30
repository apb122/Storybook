const express = require("express");
const router = express.Router();
const db = require("../db");
const requireAuth = require("../middleware/auth");
const { itemSchema } = require("../utils/validators");

// Apply auth middleware to all routes in this router
router.use(requireAuth);

// GET /api/items - List user's items
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM user_items WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/items - Create a new item
router.post("/", async (req, res) => {
  try {
    const { title, content } = itemSchema.parse(req.body);

    const result = await db.query(
      "INSERT INTO user_items (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [req.userId, title, content],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
