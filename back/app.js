var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 2604;

var server = http.createServer();
var get = require('./get');

var data = [];

fs.readFile('DB.txt', 'utf8', (err, fileData) => {
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
      var chunks = [];

      request.on('data', (chunk) => {
        chunks.push(chunk);
      });

      request.on('end', () => {
        var acc = Buffer.concat(chunks);
        var stringData = acc.toString();
        var json = JSON.parse(stringData);

        data = json.listData;

        fs.writeFile('DB.txt', stringData, (err) => {
          if (err) {
            console.error('There was an error writing the file:', err);
          } else {
            console.log('File has been written');
          }
        });

        response.statusCode = 200;
        response.end();
      });
      break;

    case 'DELETE':
      data = [];
      fs.writeFile('DB.txt', '', (err) => {
        if (err) {
          console.error('There was an error clearing the file:', err);
        } else {
          console.log('File has been cleared');
        }
      });
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
