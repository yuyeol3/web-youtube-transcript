import { YoutubeTranscript } from "youtube-transcript";

/**
 * 
 * @param {string} url 
 * @returns {Promise<TranscriptResponse[]>}
 */
export async function getYoutubeTranscript(url) {
    let transcript = await YoutubeTranscript.fetchTranscript(url);
    return transcript;
}

export async function getVidTitle(url) {
    let res = await fetch(url);
    let text = await res.text();

    // 정규식 사용
    const match = text.match(/<title>(.*?)<\/title>/);

    // 추출된 내용 확인
    if (match && match[1]) {
        let title = decodeHTMLEntities(match[1]);
        title = title.replace(" - YouTube", "");

        // console.log(match[1]);  // 출력: &#39;날씨의 아이&#39;에서 도쿄가 홍수에 잠겨버리는 이유 - YouTube
        return title;
    }

    return "(Not Found)";
}

export function decodeHTMLEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

export function getAPIKey() {
    const key = window.localStorage.getItem("openAIkey");

    return key === undefined ? "" : key;
}

// module.exports = {getYoutubeTranscript, getVidTitle, decodeHTMLEntities, getAPIKey};