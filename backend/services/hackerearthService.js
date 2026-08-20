const axios = require("axios");

function convertTime(time){
    return  Math.floor(
        new Date(`${time}Z`).getTime() / 1000
    );
}

async function getHackerEarthContests() {
    try{
        const response = await axios.get(
            "https://www.hackerearth.com/api/community/challenges/compete/",
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    Accept: "application/json",
                },
            }
        );

        const data = response.data.data;

        const now = Math.floor(Date.now()/1000);
        const oneMonthAgo = now - 30*60*60*24;

        const formattedContestItem = (contest) => {
            const startUnix = convertTime(contest.start);
            const endUnix = convertTime(contest.end);

            return {
                title: `${contest.title} (${contest.company_name})`,
                titleSlug: contest.slug,
                startTime: startUnix,
                duration: endUnix - startUnix,
                endTime: endUnix,
                platform: "hackerearth",
                url: contest.url.startsWith("http")
                    ? contest.url
                    : `https://www.hackerearth.com${contest.url}`,
            }
        }

        const live = data.filter(
            contest => convertTime(contest.start)<=now && convertTime(contest.end)>now)
            .map(formattedContestItem);

        const upcoming = data.filter(
            contest => convertTime(contest.start)>now)
            .map(formattedContestItem);

        const past = data.filter(
            contest => convertTime(contest.end)<=now && 
                        convertTime(contest.end)>=oneMonthAgo)
            .map(formattedContestItem);
        
        return{live, upcoming, past};

    }catch(error){
        console.error("Error in hackerEarthService: ", error.message);
        return { live: [], upcoming: [], past: [] };
    }
}

module.exports = {
    getHackerEarthContests,
};