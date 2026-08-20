const axios = require("axios");
const cheerio = require("cheerio");

const ATCODER_CONTESTS_URL = "https://atcoder.jp/contests";

const THIRTY_DAYS_SECONDS = 30*24*60*60;

function toUnixSeconds(dateString){
    if(!dateString) return null;

    const ms = new Date(dateString).getTime();
    return Number.isNaN(ms) ? null : Math.floor(ms/1000);
}

function parseDuration(durationText) {
    if(!durationText) return null;

    const parts = durationText.trim().split(":").map(Number);

    if(parts.length!==2 || parts.some(Number.isNaN))
        return null;

    const [hours, minutes] = parts;

    return hours * 60 * 60 + minutes * 60;
}

function formatContest($, row){
    try {
        const cells = $(row).find("td");

        if(cells.length < 3)
            return null;

        const startTimeText = $(cells[0]).text().trim();

        // contest name + URL
        const link = $(cells[1]).find("a").first();
        const title = link.text().trim();
        const href = link.attr("href");

        console.log("TITLE:", JSON.stringify(title));
        console.log("RAW HREF:", JSON.stringify(href));

        const durationText = $(cells[2]).text().trim();

        if(!title || !href || !startTimeText || !durationText)
            return null;

        const startTime = toUnixSeconds(startTimeText);
        const duration = parseDuration(durationText);

        if(startTime === null || duration === null)
            return null;

        const endTime = startTime + duration;

        const url = new URL(href, ATCODER_CONTESTS_URL).href;
        console.log("GENERATED URL:", JSON.stringify(url));


        const titleSlug = href
            .split("/").filter(Boolean).pop();

        return {
            title,
            titleSlug,
            startTime,
            duration,
            endTime,
            platform: "atcoder",
            url,
        } 
    } catch {
        return null;
    }
}


function scrapeContestTable($, tableId) {
    const contests = [];

    $(`${tableId} tbody tr`).each((_, row) => {
        const contest = formatContest($, row);
        
        if(contest)
            contests.push(contest);
    });

    return contests;
}

function formatPermanentContest($, row) {
    try {
        const link = $(row).find("td").first().find("a").first();

        const title = link.text().trim();
        const href = link.attr("href");

        if (!title || !href) {
            return null;
        }

        const url = new URL(
            href,
            ATCODER_CONTESTS_URL
        ).href;

        const titleSlug = href
            .split("/")
            .filter(Boolean)
            .pop();

        return {
            title,
            titleSlug,
            startTime: null,
            duration: null,
            endTime: null,
            platform: "atcoder",
            url,
        };
    } catch {
        return null;
    }
}

function scrapePermanentContests($) {
    const contests = [];

    $("#contest-table-permanent tbody tr").each((_, row) => {
        const contest = formatPermanentContest($, row);

        if (contest) {
            contests.push(contest);
        }
    });

    return contests;
}

//fetch atcoder
async function fetchAtcoderContests() {
    try {
        const response = await axios.get(ATCODER_CONTESTS_URL, {
            headers: { "User-Agent": "Mozilla/5.0",},
            timeout: 10000,
        });

        const $ = cheerio.load(response.data);

        const upcoming = scrapeContestTable($, "#contest-table-upcoming");

        const daily = scrapeContestTable($, "#contest-table-daily");

        const permanent = scrapePermanentContests($);

        const recent = scrapeContestTable($, "#contest-table-recent");

        return [
            ...upcoming,
            ...daily,
            ...permanent,
            ...recent,
        ];
    } catch (error) {
        console.error("atcoderService: failed to fetch contests: ", error.message);
        return [];
    }
}


function deduplicateContests(contests){
    return contests.filter(
        (contest, index, arr) => 
            arr.findIndex((c) => c.titleSlug === contest.titleSlug) === index
    );
}

function classifyContests(contests) {
    const now = Math.floor(Date.now() / 1000);
    const oneMonthAgo = now - THIRTY_DAYS_SECONDS;
    
    const live = contests.filter((contest) => {
        if ( contest.startTime === null && contest.endTime === null ) {
            return true;
        }

        return ( contest.startTime <= now && contest.endTime > now );
    });

    const upcoming = contests.filter(
        (contest) => contest.startTime > now
    );

    const past = contests.filter(
        (contest) => contest.endTime < now && contest.endTime > oneMonthAgo
    );

    return {
        live, upcoming, past,
    };
}

async function getAtcoderContests() {
    const allRaw = await fetchAtcoderContests();

    console.log("RAW COUNT:", allRaw.length);
    console.log("RAW SAMPLE:", allRaw.slice(0, 3));

    const all = deduplicateContests(allRaw);

    console.log("DEDUP COUNT:", all.length);

    const result = classifyContests(all);

    console.log(
        "COUNTS:",
        "live =", result.live.length,
        "upcoming =", result.upcoming.length,
        "past =", result.past.length
    );

    return result;
}

module.exports = {
    getAtcoderContests,
};