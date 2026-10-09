const axios = require("axios");

const BASE_URL = "https://www.naukri.com/code360/api/v4/public_section/contest_list";
const CONTEST_URL_BASE = "https://www.naukri.com/code360/contests";

const HEADERS={
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
};

const ONE_MONTH_AGO_SECONDS = 30*24*60*60;
const MAX_PAST_PAGES= 5;

function formatNaukriContest(contest) {
    const startTime= contest.event_start_time;
    const endTime =  contest.event_end_time;
    
    return {
        title: contest.name,
        titleSlug: contest.slug,
        startTime,
        duration: endTime - startTime,
        endTime,
        platform: "naukri",
        url: `${CONTEST_URL_BASE}/${contest.slug}`,
    };
}

async function fetchUpcomingRaw(){
    const url = `${BASE_URL}?page_size=10&page=1&participate=true&request_differentiator=${Date.now()}&app_context=publicsection&naukri_request=true`;
    const response= await axios.get(url, {headers:HEADERS, timeout:10000});

    if(response.data.status !==200){
        throw new Error("Failed to pull upcoming/live data from Naukri gateway");
    }

    return response.data.data.events || [];
}

async function fetchPastRaw(){
    const now = Math.floor(Date.now() / 1000);
    const cutoff = now - ONE_MONTH_AGO_SECONDS;
    const collected = [];

    for(let page = 1; page <= MAX_PAST_PAGES; page++){
        const url = `${BASE_URL}?page_size=10&page=${page}&participate=&category[]=code_360&status=past&request_differentiator=${Date.now()}&app_context=publicsection&naukri_request=true`;
        const response = await axios.get(url, { headers: HEADERS, timeout: 10000 });

        if(response.data.status!== 200){
            throw new Error("Failed to pull past data from Naukri gateway");
        }

        const pageContests = response.data.data.past_contest || [];
        if(pageContests.length === 0)break;

        collected.push(...pageContests);

        const oldestOnPage = pageContests[pageContests.length - 1];
        if (oldestOnPage.event_start_time < cutoff) break;
    }
    return collected;
}


async function getNaukriContests() {
    try{
        const [upcomingRaw, pastRaw] = await Promise.all([
            fetchUpcomingRaw(),
            fetchPastRaw(),
        ]);

        const deduped =  new Map();
        for(const contest of [...upcomingRaw, ...pastRaw]){
             if (contest && contest.id != null && !deduped.has(contest.id)) {
                deduped.set(contest.id, contest);
            }
        }

        const now = Math.floor(Date.now() / 1000);
        const live = [];
        const upcoming = [];
        const past = [];

         for (const contest of deduped.values()) {
            if (
                typeof contest.event_start_time !== "number" ||
                typeof contest.event_end_time !== "number"
            ) {
                continue;
            
            }

            const formatted = formatNaukriContest(contest);

            if (contest.event_start_time <= now && now < contest.event_end_time) {
                live.push(formatted);
            } else if (now < contest.event_start_time) {
                upcoming.push(formatted);
            } else {
                past.push(formatted);
            }
         } 
        return { live, upcoming, past };        
    }catch(error){
        console.error("Error in Naukri Code360: ", error.message);
        return{live:[], upcoming:[], past:[] };
    }
}
    module.exports = {
    getNaukriContests,
 };
 