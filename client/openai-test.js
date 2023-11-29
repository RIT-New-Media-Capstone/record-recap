// Following tutorial to do Speech-to-Text in Node.js from 
// https://www.codingthesmartway.com/speech-to-text-use-nodejs-and-openai-whisper-api-to-record-transcribe-in-one-step/

const OpenAI = require('openai');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const mic = require('mic');
const { Readable } = require('stream');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg');
const { exec } = require('child_process');

// import OpenAI from "openai";
// import fs from 'fs';
// import ffmpeg from 'fluent-ffmpeg';
// import mic from 'mic';
// import { Readable } from 'stream';
// import ffmpegPath from '@ffmpeg-installer/ffmpeg';
// import { exec } from 'child_process';

//variables
// const recordBtn = document.getElementById('recordBtn');
// const summarizeBtn = document.getElementById('summarizeBtn');
// const summaryDiv = document.getElementById('summaryResponse');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

ffmpeg.setFfmpegPath(ffmpegPath);

let audioFile = "OprahWinfreyMotivationSpeech.mp3";
let format = "Summarize content you are provided in 2 bullet points."

// Record audio from the user's microphone and save it to the specified file
// Param: the name of the file where the recorded audio will be saved
const recordAudio = (filename) => {
    // returns a new Promise that resolves or rejects based on the 
    // success or failure of the recording process
    return new Promise((resolve, reject) => {
        // a new micInstance is created using the mic package with specified configuration
        const micInstance = mic({
            rate: '16000', // sample rate in Hz
            channels: '1', // one audio channel (mono)
            fileType: 'wav',
        });

        // 5 minute max duration of the recording, in seconds
        const maxDuration = 5 * 60;

        const micInputStream = micInstance.getAudioStream();
        const output = fs.createWriteStream(filename);
        const writeable = new Readable().wrap(micInputStream);
        const ffmpegCommand = `ffmpeg -t ${maxDuration} ${output}`;

        // connecting the microphone input to the output file
        writeable.pipe(output);

        // starts recording audio
        micInstance.start();
        console.log('Recording... Press Ctrl+C to stop.'); // indicate the recording started

        // add a listener for when ctrl+c is pressed
        process.on('SIGINT', () => {
            micInstance.stop();
            console.log('Finished recording.'); // indicate the recording stopped
            resolve(); // resolve the Promise
        });

        // add error listener
        micInputStream.on('error', (err) => {
            // if an error occurs, reject the Promise with the error
            reject(err);
        });
    });
};

// Transcribes a recorded audio file using OpenAI's Whisper API
// and returns the transcribed text as a string.
// Param: name of the file containing the recorded audio
async function transcribeAudio(file) {
    const transcript = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: fs.createReadStream(file),
    });
    return transcript.text;
}

// Summarizes a string using OpenAI's gpt-3.5-turbo model
// and returns the summary as a string.
// Param: name of the file containing the text to summarize, formate of how to summarize
async function summarizeTranscript(transcript, format) {
    let test = "hi";
    return test;
    // const sum = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //         { "role": "system", "content": format },
    //         { "role": "user", "content": transcript }
    //     ],
    //     temperature: 0,
    //     max_tokens: 1024,
    // });
    // return sum.choices[0].message.content;
}

// Main function
// calls recordAudio() and transcribeAudio()
const main = async () => {
    const audioFilename = 'recorded_audio.wav'; // name of the file where audio will be stored

    // recordBtn.addEventListener('click', async () => {
    //     console.log('Recording...');
    //     await recordAudio(audioFilename); // record the audio and save to the file name
    // });

    // summarizeBtn.addEventListener('click', async () => {
    //     // const transcription = await transcribeAudio(audioFilename); // transcribe the audio
    //     console.log('Transcription: ' + transcription);

    //     // const sum = await summarizeTranscript(transcription, format);
    //     console.log('Summary:', sum);

    //     // summaryDiv.innerHTML = sum;
    // });
};

// window.onload = main;

module.exports = {
    recordAudio,
    transcribeAudio,
    summarizeTranscript,
    main,
};