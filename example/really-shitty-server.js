const http = require('http');

const failRate = .3;

http.createServer((req, res) => {
  let statusCode = 200;
  let message = { status: 'OK!' };

  const shouldThisCallFail = Math.random() < failRate
  if (shouldThisCallFail) {
    statusCode = 500;
    message = { status: 'An error occurred :(' };
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