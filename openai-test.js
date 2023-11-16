import OpenAI from "openai";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath);

const openai = new OpenAI();

async function transcribeAudio() {
    const transcript = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: fs.createReadStream("TestRecording.m4a"),
        // promt: "Transcribe the following audio recording and style it into a haiku:",
    });
    return transcript.text;
}

async function main() {
    const transcription = await transcribeAudio();
    console.log('Transcription:', transcription);
}

main();
