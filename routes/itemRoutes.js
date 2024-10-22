const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");
require("dotenv").config();
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("item routes req", req.body);
    const { title, description } = req.body;
    const newItem = new Item({
      title,
      description,
      user: req.user.id,
    });
    const savedItem = await newItem.save();
    console.log("items route saved item", savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item" });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  try {
    // this finds the items that matches the current users id
    const items = await Item.find({ user: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to get items" });
  }
});
module.exports = router;
