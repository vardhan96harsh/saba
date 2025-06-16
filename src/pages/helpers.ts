



export const fetchVideoDataFromUrl = async (url:string) => {
    try {
        let refId = url?.split('ref:') ?? '';
        return await fetch(`https://edge.api.brightcove.com/playback/v1/accounts/1160438706001/videos/ref:${refId[1]}`, {
            "headers": {
                "accept": "application/json;pk=BCpkADawqM3GsgvMe3MEZVkqGCYwqTlwxjGB-OAxySi6SGAKyxo1wbCZCl3Qc_cToq1rYNVXI538licOT0453ROpyF1hdKfzcdYNA4maJ34_tk2njxMSnn4xgGlxPagO6eJbR3Yxbk0dJPo2",
            },
            "method": "GET",
        }).then(async (response) => {
            let data = await response.json();
            return data
        });
    } catch (error) {
        return false;
    }
};