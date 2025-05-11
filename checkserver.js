// Save this as check-server.js

const http = require('http');

console.log('Checking if server is running on localhost:5000...');

// Function to attempt connection
function checkServer() {
  const req = http.get('http://localhost:5000', (res) => {
    console.log(`Server is running! Status code: ${res.statusCode}`);
    console.log('Server health check successful!');
    process.exit(0);
  });

  req.on('error', (err) => {
    console.error('Server connection error:');
    console.error(`Error: ${err.message}`);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your server is started (node server.js)');
    console.log('2. Check if MongoDB is running if your server depends on it');
    console.log('3. Verify that port 5000 is not in use by another application');
    console.log('4. Check server logs for startup errors');
    process.exit(1);
  });

  req.end();
}

// Run the check
checkServer();