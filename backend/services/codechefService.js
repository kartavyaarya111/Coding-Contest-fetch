const axios = require("axios");

async function getCodeChefContests() {
    try{
        const response = await axios.get(
            "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all",
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    Accept: "application/json",
                },
            }
        );

        const data = response.data;
        if (data.status !== "success"){
            throw new Error("Failed to pull data from CodeChef gateway");
        }

        const now = Math.floor(Date.now()/1000);
        const oneMonthAgo = now - 30*60*60*24;

        const formattedContestItem = (contest) => {
            const startUnix = Math.floor(
                new Date(contest.contest_start_date_iso).getTime() / 1000
            );
            const durationSeconds = parseInt(contest.contest_duration, 10) * 60;
            const endUnix = startUnix + durationSeconds;

            return {
                title: contest.contest_name,
                titleSlug: contest.contest_code,
                startTime: startUnix,
                duration: durationSeconds,
                endTime: endUnix,
                platform: "codechef",
                url: `https://www.codechef.com/${contest.contest_code}`,
            };
        }

        const live = (data.present_contests || []).map(formattedContestItem);
        const upcoming = (data.future_contests || []).map(formattedContestItem);
        const past = (data.past_contests || [])
            .map(formattedContestItem)
            .filter((contest) => contest.endTime >= oneMonthAgo);

        return {live, upcoming, past};
    }catch (error) {
        console.error("Error in codechefService:", error.message);
        return { live: [], upcoming: [], past: [] };
    }
}

module.exports = {
  getCodeChefContests,
};
