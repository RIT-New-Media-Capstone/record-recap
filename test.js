import OpenAI from "openai";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath);

const openai = new OpenAI();
let audioFile = "OprahWinfreyMotivationSpeech.mp3";
let format = "Summarize content you are provided in 2 bullet points."
// let format = "Summarize content you are provided with for a second-grade student in 2 bullet points."

async function transcribeAudio(file) {
    const transcript = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: fs.createReadStream(file),
    });
    return transcript.text;
}

async function summarizeTranscript(transcript, format) {
   const sum = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages:[
            {"role": "system", "content": format},
            {"role": "user", "content": transcript}
          ],
        temperature: 0,
        max_tokens: 1024,
    });
    return sum.choices[0].message.content;
}


async function main() {
    const transcript = await transcribeAudio(audioFile);
    // console.log('Transcription:', transcript);

    const sum = await summarizeTranscript(transcript, format);
    console.log('Summary:', sum);
}

main();
