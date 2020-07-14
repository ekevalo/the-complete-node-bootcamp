const EventEmitter = require('events');
const http = require('http');

const myEmitter = new EventEmitter();

myEmitter.on('newSale', () => {
	console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
	console.log('Customer name: Jonas');
});

myEmitter.emit('newSale');

const server = http.createServer();

server.on('request', (req, res) => {
	console.log('Request Received');
	res.end('Request Received');
});

server.on('request', (req, res) => {
	console.log('Another request :)');
});

server.on('close', () => {
	console.log('Server Closed');
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Waiting for reequests ...');
});
