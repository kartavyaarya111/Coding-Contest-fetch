const axios = require("axios");

async function getLeetCodeContests() {
  const query = `
    query {
      allContests {
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
        "User-Agent": "Mozilla/5.0",
      },
    }
  );

  const contests = response.data.data.allContests;
  const now = Math.floor(Date.now() / 1000);
  const oneMonthAgo = now - (30 * 24 * 60 * 60);

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
    past: formattedContests.filter((contest) => contest.endTime < now && contest.endTime > oneMonthAgo),
  };
}

module.exports = {
  getLeetCodeContests,
};
