const crypto = require('crypto');
const http = require('http');

const failRate = .3;

http.createServer((req, res) => {
  let statusCode = 200;
  let message = { url: `https://some-channel.stream?token=${crypto.randomBytes(5).toString('hex')}`, secret: crypto.randomBytes(20).toString('hex') };

  const shouldThisCallFail = Math.random() < failRate
  if (shouldThisCallFail) {
    statusCode = 500;
    message = { message: 'An error occurred :(' };
    return sendResponse(res, statusCode, message);
  }
  const delay = Math.random() * 2000; // somewhere between 0 and 2000ms delay
  // send response after "delay" ms
  setTimeout(() => sendResponse(res, statusCode, message), delay);
}).listen(3000);

console.log('server running on port 3000');


function sendResponse(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json ' });
  res.end(JSON.stringify(message, null, 2));
}