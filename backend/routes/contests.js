const express = require("express");
const { getLeetCodeContests } = require("../services/leetcodeService");
const { getCodeChefContests } = require("../services/codechefService");

const router = express.Router();

router.get("/leetcode", async (req, res) => {
  try {
    const leetcode = await getLeetCodeContests();

    res.json(leetcode);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch contests",
    });
  }
});

router.get("/codechef", async (req, res) => {
  try {
    const codechef = await getCodeChefContests();

    res.json(codechef);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch contests",
    });
  }
});

module.exports = router;
