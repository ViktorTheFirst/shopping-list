const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 2604;

const server = http.createServer();
const get = require('./get');
const filePath = 'DB.txt';

let data = [];
let logs = '';

fs.readFile(filePath, 'utf8', (err, fileData) => {
  if (err) {
    console.error('There was an error reading the file:', err);
  } else {
    if (!fileData) return;
    const parsedList = JSON.parse(fileData);
    data = parsedList.listData;
  }
});

const countItems = (arr) => {
  return arr.length || 0;
};

server.on('request', (request, response) => {
  // log every new ip to file

  fs.readFile('LOGS.txt', 'utf8', (err, fileData) => {
    if (err) {
      console.error('There was an error reading the logs file:', err);
    } else {
      if (!fileData) return;
      logs = fileData;
    }
  });
  console.log('logs', logs);
  console.log('logs.included?', logs.includes(request.headers.origin));
  if (!logs.includes(request.headers.origin.toString())) {
    fs.appendFile('LOGS.txt', `${request.headers.origin}\n`, (err) => {
      if (err) {
        console.error('There was an error writing the logs file:', err);
      } else {
        console.log('Log was added');
      }
    });
  }

  switch (request.method) {
    case 'GET':
      console.log('---------------------------------------------');
      console.log('GET request was sent from: ', request.headers.origin);
      request.data = data;
      get(request, response);
      break;

    case 'POST':
      let chunks = [];

      request.on('data', (chunk) => {
        chunks.push(chunk);
      });

      request.on('end', () => {
        const acc = Buffer.concat(chunks);
        const stringData = acc.toString();
        const json = JSON.parse(stringData);

        data = json.listData;
        console.log('---------------------------------------------');
        console.log('POST request was sent from: ', request.headers.origin);
        fs.writeFile(filePath, stringData, (err) => {
          if (err) {
            console.error('There was an error writing the file:', err);
          } else {
            console.log(
              `File was writen, list is now consists of ${countItems(
                json.listData
              )} items`
            );
          }
        });
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Headers', '*');
        response.setHeader('Access-Control-Allow-Methods', '*');
        response.statusCode = 200;
        response.end();
      });
      break;

    case 'DELETE':
      data = [];
      console.log('---------------------------------------------');
      console.log('List was deleted by: ', request.headers.origin);
      fs.writeFile(filePath, '', (err) => {
        if (err) {
          console.error('There was an error clearing the file:', err);
        } else {
          console.log('File has been cleared');
        }
      });
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Headers', '*');
      response.setHeader('Access-Control-Allow-Methods', '*');
      response.statusCode = 200;
      response.end();
      break;

    case 'OPTIONS':
      response.statusCode = 200;
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Headers', '*');
      response.setHeader('Access-Control-Allow-Methods', '*');
      response.setHeader('Content-Type', '*');
      response.end();
      break;

    default:
      response.statusCode = 400;
      response.write('No Response');
      response.end();
  }
});

server.listen(port, (error) => {
  if (error) {
    console.log('Error on server', error);
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});
