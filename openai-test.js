// Following tutorial to do Speech-to-Text in Node.js from 
// https://www.codingthesmartway.com/speech-to-text-use-nodejs-and-openai-whisper-api-to-record-transcribe-in-one-step/

import OpenAI from "openai";
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import mic from 'mic';
import { Readable } from 'stream';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import {exec} from 'child_process';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

ffmpeg.setFfmpegPath(ffmpegPath);

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
const transcribeAudio = async (filename) => {
  // send the audio data to the Whisper API for transcription
  // const audio = await fs.readFile(filename);
  // const audio = fs.createReadStream(filename);
  const transcript = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filename),
    model: "whisper-1",
  });
  // return the transcribed text
  return transcript.text;
};

// Main function
// calls recordAudio() and transcribeAudio()
const main = async () => {
  const audioFilename = 'recorded_audio.wav'; // name of the file where audio will be stored
  await recordAudio(audioFilename); // record the audio and save to the file name
  const transcription = await transcribeAudio(audioFilename); // transcribe the audio
  
  console.log('Transcription: ' + transcription);
};

main();



// const response = await openai.chat.completions.create({
//   model: "gpt-3.5-turbo",
//   messages: [{role: "user", content: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky, and has been known to ancient civilizations since before recorded history. It is named after the Roman god Jupiter.[19] When viewed from Earth, Jupiter can be bright enough for its reflected light to cast visible shadows,[20] and is on average the third-brightest natural object in the night sky after the Moon and Venus."}],
//   temperature: 0,
//   max_tokens: 1024,
// });

// console.log(response.choices[0]);


// const response = await openai.chat.completions.create({
//   model: "gpt-3.5-turbo",
//   messages: [{role: "user", content: "Say this is a test!"}],
//   temperature: 0,
//   max_tokens: 1024,
// });

// console.log(response.choices[0]);
