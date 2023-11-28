const http = require('http'); // pull in the http server module
const url = require('url'); // pull in the url module
const query = require('querystring');
const responses = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': responses.getIndex,
    '/dist/output.css': responses.getCss,
    '/openai-test.js': responses.getJs,
    '/summarize': responses.summarizeTranscript,
};

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);

    const params = query.parse(parsedUrl.query);

    if (urlStruct[parsedUrl.pathname]) {
        urlStruct[parsedUrl.pathname](request, response, params);
    }
};

// start HTTP server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);