const axios = require("axios");
const cheerio = require("cheerio");

async function getHackerRankContests() {
    const response = await axios.get("https://www.hackerrank.com/contests", {
        headers: { "User-Agent": "Mozilla/5.0"},
        timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const raw = $('#initialData').html();

    if(!raw) {
        throw new Error("Could not find initialData script on HackerRank contests page");
    }

    const data = JSON.parse(decodeURIComponent(raw.trim()));
    const allContest = data.community.contests.allContest;

    const now = Math.floor(Date.now() / 1000);
    const oneMonthAgo = now - (30*24*60*60);

    const formattedNative = (c) => ({
        title: c.name,
        titleSlug: c.slug,
        startTime: c.epoch_starttime,
        duration: c.epoch_endtime - c.epoch_starttime,
        endTime: c.epoch_endtime,
        platform: "hackerrank",
        url: `https://www.hackerrank.com/${c.slug}`,
    });

    const nativeContests = Object.values(allContest.contest || {}).filter(
        (c) => c.slug !== "master" && c.epoch_starttime && c.epoch_endtime
    );

    const formattedEvent = (e) => {
        const startTime = Math.floor(new Date(e.start_time).getTime() / 1000);
        const endTime = Math.floor(new Date(e.end_time).getTime() / 1000);
        return {
            title: e.name,
            titleSlug: e.id,
            startTime,
            duration: endTime - startTime,
            endTime,
            platform: "hackerrank",
            url: e.microsite_url,
        };
    };

    const events = [
        ...(allContest.promotedContests || []),
        ...(allContest.pastEvents || []),
    ].map(formattedEvent)
    .filter((e, index, arr) =>
        arr.findIndex(x => x.titleSlug === e.titleSlug) === index
    );

    const all = [...nativeContests.map(formattedNative), ...events];

    const live = all.filter((c) => c.startTime<=now && c.endTime>now);
    const upcoming = all.filter((c) => c.startTime > now);
    const past = all.filter((c) => c.endTime < now && c.endTime > oneMonthAgo);

    return { live, upcoming, past };
}

module.exports = {
    getHackerRankContests,
};