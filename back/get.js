module.exports = (request, response) => {
  switch (request.url) {
    case '/list':
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Headers', '*');
      response.setHeader('Access-Control-Allow-Methods', '*');
      response.write(JSON.stringify(request.data));
      response.end();
      break;

    default:
      response.statusCode = 400;
      response.write(`CANNOT GET ${request.url}`);
      response.end();
  }
};
