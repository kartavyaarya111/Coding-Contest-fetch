const axios = require("axios");
const cheerio = require("cheerio");

const STANDALONE_CONTESTS_URL = 
    "https://practiceapi.geeksforgeeks.org/api/vr/events/?page_number=1&sub_type=all&type=contest";

const WEEKLY_CONTEST_PAGE_URL = 
    "https://www.geeksforgeeks.org/events/rec/gfg-weekly-coding-contest";

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

function toUnixSeconds(isoString) {
    if (!isoString) return null;
    const ms = new Date(isoString).getTime();
    return Number.isNaN(ms) ? null : Math.floor(ms / 1000);
}

function formatStandaloneContest(contest) {
    try {
        const startTime = toUnixSeconds(contest?.start_time);
        const endTime = toUnixSeconds(contest?.end_time);
        const title = contest?.name;
        const slug = contest?.slug;

        if(!title || !slug || startTime === null || endTime === null)
            return null;

        return {
            title,
            titleSlug: slug,
            startTime,
            duration: endTime - startTime,
            endTime,
            platform: "gfg",
            url: `https://practice.geeksforgeeks.org/contest/${slug}`,
        };
    } catch {
        return null;
    }
}

function formatWeeklyContest(entry) {
    try {
        const startTime = toUnixSeconds(entry?.start_time);
        const title = entry?.name;
        const url = entry?.event_entity_url;
        const totalTimeMinutes = parseInt(entry?.total_time, 10);

        if(!title || !url || startTime === null || Number.isNaN(totalTimeMinutes))
            return null;

        const duration = totalTimeMinutes * 60;
        const endTime = startTime + duration;

        return {
            title,
            titleSlug: entry?.entity_id ?? title,
            startTime,
            duration,
            endTime,
            platform: "gfg",
            url,
        };
    } catch {
        return null;
    }
}

async function fetchStandaloneContests() {
    try {
        const response = await axios.get(STANDALONE_CONTESTS_URL, {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 10000,
        });

        const results = response?.data?.results;
        if(!results) return [];

        const raw = [...(results.upcoming || []), ...(results.past || [])];
        return raw.map(formatStandaloneContest).filter(Boolean);
    } catch (error) {
        console.error("gfgService: failed to fetch standalone contests:", error.message);
        return [];
    }
}

async function fetchWeeklyContests() {
    try {
        const response = await axios.get(WEEKLY_CONTEST_PAGE_URL, {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 10000,
        });

        const $ = cheerio.load(response.data);
        const raw = $('#__NEXT_DATA__').html();

        if(!raw) {
            console.error("gfgService: could not find __NEXT_DATA__ script tag (GFG markup may have changed)");
            return [];
        }

        const data = JSON.parse(raw);
        const pageProps = data?.props?.pageProps;
        if (!pageProps) return [];

        const highlighted = pageProps?.upcomingEvent?.event_entity_details
            ? [pageProps.upcomingEvent.event_entity_details]
            : [];

        const past = pageProps?.pastEvents || [];

        return [...highlighted, ...past].map(formatWeeklyContest).filter(Boolean);
    } catch (error) {
        console.error("gfgService: failed to fetch weekly contests:", error.message);
        return [];
    }
}

async function getGfgContests() {
    const [standalone, weekly] = await Promise.all([
        fetchStandaloneContests(),
        fetchWeeklyContests(),
    ]);

    console.log("DEBUG standalone count:", standalone.length);
    console.log("DEBUG weekly count:", weekly.length);
    console.log("DEBUG standalone sample:", standalone.slice(0, 2));
    console.log("DEBUG weekly sample:", weekly.slice(0, 2));

    const all = [...standalone, ...weekly].filter(
        (contest, index, arr) =>
            arr.findIndex((c) => c.titleSlug === contest.titleSlug) === index
    );

    console.log("DEBUG all count after dedup:", all.length);

    const now = Math.floor(Date.now() / 1000);
    const oneMonthAgo = now - THIRTY_DAYS_SECONDS;
    console.log("DEBUG now:", now, "oneMonthAgo:", oneMonthAgo);

    const live = all.filter((c) => c.startTime<=now && c.endTime>now);
    const upcoming = all.filter((c) => c.startTime>now);
    const past = all.filter((c) => c.endTime < now && c.endTime>oneMonthAgo);

    console.log("DEBUG live/upcoming/past counts:", live.length, upcoming.length, past.length);
    
    return { live, upcoming, past };
}

module.exports = {
    getGfgContests,
};