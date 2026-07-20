const axios = require("axios");

async function getCodeforcesContests() {
    try{
        const response = await axios.get(
            "https://codeforces.com/api/contest.list",
            { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 10000 }
        );
        console.log(response.status, response.data.status, response.data.comment);

        if (response.data.status !== "OK"){
            throw new Error("Failed to pull data from Codeforces gateway");
        }
        const contests = response.data.result;

        const now = Math.floor(Date.now() / 1000);
        const oneMonthAgo = now - (30 * 24 * 60 *60);

        const formattedContestItem = (contest) => {
            return {
                title: contest.name,
                titleSlug: contest.id,
                startTime: contest.startTimeSeconds,
                duration: contest.durationSeconds,
                endTime: (contest.startTimeSeconds + contest.durationSeconds),
                platform: "codeforces",
                url: `https://codeforces.com/contest/${contest.id}`,
            };
        }

        const live = contests.filter(
            contest => contest.phase === "CODING")
            .map(formattedContestItem);

        const upcoming = contests.filter(
            contest => contest.phase === "BEFORE")
            .map(formattedContestItem);

        const past = contests.filter(
            contest => contest.phase === "FINISHED"
                        && (contest.startTimeSeconds > oneMonthAgo))
                        .map(formattedContestItem);

        return {live, upcoming, past};
    } catch (error) {
        console.error("Error in  Codeforces: ", error.message);
        return { live: [], upcoming: [], past: []};
    }    
}

module.exports = {
    getCodeforcesContests,
};