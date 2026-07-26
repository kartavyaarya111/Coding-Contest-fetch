const express = require("express");
const { getLeetCodeContests } = require("../services/leetcodeService");
const { getCodeChefContests } = require("../services/codechefService");
const { getCodeforcesContests } = require("../services/codeforcesService");
const { getHackerRankContests } = require("../services/hackerrankService");
const router = express.Router();

const handleRequest = (service) => async (req,res) => {
  try{
    const data = await service();
    res.json(data);
  }catch(error){
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch contests",
    });
  }
}

router.get("/leetcode", handleRequest(getLeetCodeContests));

router.get("/codechef", handleRequest(getCodeChefContests));

router.get("/codeforces", handleRequest(getCodeforcesContests));

router.get("/hackerrank", handleRequest(getHackerRankContests));

module.exports = router;
