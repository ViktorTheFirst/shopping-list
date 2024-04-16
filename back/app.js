const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 2604;

const server = http.createServer();
const get = require('./get');
const filePath = 'DB.txt';

let data = [];

// TODO: use file system after my server will be ready
fs.readFile(filePath, 'utf8', (err, fileData) => {
  if (err) {
    console.error('There was an error reading the file:', err);
  } else {
    if (!fileData) return;
    const parsedList = JSON.parse(fileData);
    data = parsedList.listData;
  }
});

server.on('request', (request, response) => {
  console.log('Method', request.method);
  switch (request.method) {
    case 'GET':
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

        // TODO: use file system after my server will be ready
        fs.writeFile(filePath, stringData, (err) => {
          if (err) {
            console.error('There was an error writing the file:', err);
          } else {
            console.log('File has been written');
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
      // TODO: use file system after my server will be ready
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
