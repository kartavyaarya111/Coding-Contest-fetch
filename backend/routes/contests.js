const express = require("express");
const { getLeetCodeContests } = require("../services/leetcodeService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const leetcode = await getLeetCodeContests();

    res.json({
      leetcode,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch contests",
    });
  }
});

module.exports = router;
