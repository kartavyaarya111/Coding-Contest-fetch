const express = require("express");
const { getLeetCodeContests } = require("../services/leetcodeService");
const { getCodeChefContests } = require("../services/codechefService");
const { getCodeforcesContests } = require("../services/codeforcesService");
console.log("codeforces service loaded as:", typeof getCodeforcesContests);
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

module.exports = router;
