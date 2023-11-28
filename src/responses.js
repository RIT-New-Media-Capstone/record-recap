const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const css = fs.readFileSync(`${__dirname}/../dist/output.css`);

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

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
    getIndex,
    getCss,
};