const fs = require('fs'); // pull in the file system module
import * as openai from '../client/openai-test';

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const css = fs.readFileSync(`${__dirname}/../dist/output.css`);
const js = fs.readFileSync(`${__dirname}/../client/openai-test.js`);

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

const summarizeTranscript = async (request, response) => {
    //parse params out of string
    const params = request.url.split('?')[1].split('&');
    console.log(params);
    openai.summarizeTranscript(params[0], params[1]);
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
    getIndex,
    getCss,
    getJs,
};