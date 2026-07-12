const axios = require("axios");

async function getLeetCodeContests() {
  const query = `
    query {
      upcomingContests {
        title
        titleSlug
        startTime
        duration
      }
    }
  `;

  const response = await axios.post(
    "https://leetcode.com/graphql",
    { query },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const contests = response.data.data.upcomingContests;
  const now = Math.floor(Date.now() / 1000);

  const formattedContests = contests.map((contest) => ({
    ...contest,
    platform: "leetcode",
    endTime: contest.startTime + contest.duration,
    url: `https://leetcode.com/contest/${contest.titleSlug}/`,
    isLive:
      contest.startTime <= now &&
      contest.startTime + contest.duration > now,
  }));

  return {
    live: formattedContests.filter((contest) => contest.isLive),
    upcoming: formattedContests.filter((contest) => contest.startTime > now),
  };
}

module.exports = {
  getLeetCodeContests,
};
