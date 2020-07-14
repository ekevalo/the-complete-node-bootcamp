const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Imediate 1 finished'));

fs.readFile('test-file.txt', () => {
	console.log('I/O finished');
	console.log('===================================');
	setTimeout(() => console.log('Timer 2 finished'), 0);
	setTimeout(() => console.log('Timer 3 finished'), 3000);
	setImmediate(() => console.log('Imediate 2 finished'));

	process.nextTick(() => console.log('Process.nextTick'));
});
crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512', () => {
	console.log(Date.now() - start, 'Password0 Encrypted');
});

crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512', () => {
	console.log(Date.now() - start, 'Password1 Encrypted');
});

crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512', () => {
	console.log(Date.now() - start, 'Password2 Encrypted');
});
crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512', () => {
	console.log(Date.now() - start, 'Password3 Encrypted');
});
crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512', () => {
	console.log(Date.now() - start, 'Password4 Encrypted');
});

console.log('Hello from top-level code');
