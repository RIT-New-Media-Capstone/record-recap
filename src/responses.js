const fs = require('fs'); // pull in the file system module
const openai = require('../client/openai-test');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const css = fs.readFileSync(`${__dirname}/../dist/output.css`);
const js = fs.readFileSync(`${__dirname}/../client/openai-test.js`);

const filename = 'recorded_audio.wav';

// function to handle the index page
const getIndex = (request, response) => {
    // set status code (200 success) and content type
    response.writeHead(200, { 'Content-Type': 'text/html' });
    // write an HTML string or buffer to the response
    response.write(index);
    // send the response to the client.
    response.end();
};

const getCss = (request, response) => {
    // set status code (200 success) and content type
    response.writeHead(200, { 'Content-Type': 'text/css' });
    // write an HTML string or buffer to the response
    response.write(css);
    // send the response to the client.
    response.end();
};

const getJs = (request, response) => {
    // set status code (200 success) and content type
    response.writeHead(200, { 'Content-Type': 'text/javascript' });
    // write an HTML string or buffer to the response
    response.write(js);
    // send the response to the client.
    response.end();
};

const respondJSON = (request, response, object) => {
    // set status code (200 success) and content type
    response.writeHead(200, { 'Content-Type': 'application/json' });
    // write an HTML string or buffer to the response
    response.write(JSON.stringify(object));
    // send the response to the client.
    response.end();
}

const recordAudio = async (request, response) => {
    openai.recordAudio(filename);

    console.log("respnses recordAudo function");
};

const stopRecord = async (request, response) => {
    openai.stopRecording();

    console.log("respnses stopRecord function");
};


const summarizeTranscript = async (request, response) => {
    //parse params out of string
    const params = request.url.split('?')[1].split('&');
    params[0] = params[0].split('=')[1];
    params[1] = params[1].split('=')[1];
    params[2] = params[2].split('=')[1];
    params[2] = params[2].replace(/%20/g, " ");

    console.log(params);
    // let formae = "Summarize content you are provided in 2 bullet points.";
    let formate = `Provide a ${params[0]} summary of the content you are provided in ${params[2]} style ${params[1]}.`;
    // console.log(formate);

    let transcript = await openai.transcribeAudio(filename);
    let summary = await openai.summarizeTranscript(transcript, formate);

    let res = {
        "formate": formate,
        "url": request.url,
        "summary": summary,
    };

    return respondJSON(request, response, res);
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
    getIndex,
    getCss,
    getJs,
    recordAudio,
    stopRecord,
    summarizeTranscript,
};