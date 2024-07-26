// import OpenAI from "openai";
import OpenAI from "openai";
// const {getAPIKey} = require("./utils.js");


/**
 * 
 * @param {string} transcript 
 * @param {string} key 
 * @returns 
 */
export async function getsummary(transcript, key) {

  const openai = new OpenAI({
    apiKey : key,
    dangerouslyAllowBrowser: true
  });
  
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": "You are a specialized AI designed to summarize YouTube videos. Follow these guidelines to create a comprehensive and concise summary:\n\nTitle and Description: Extract the title and main points from the video description.\nMain Content: Summarize the key points, ideas, or arguments presented in the video. Aim for a summary that is between 200-300 words.\nSpeaker Information: If there are multiple speakers or important figures, mention their names and roles briefly.\nConclusion and Takeaways: Provide a clear conclusion, summarizing the overall message and any actionable takeaways."
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": transcript
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "한국어로 해줘"
              }
            ]
          },
        ],
        temperature: 1,
        max_tokens: Math.max(Math.min(Math.floor(0.95 * transcript.length), 2500), 500),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return response.choices[0]["message"]["content"];
}

// module.exports = {getsummary};