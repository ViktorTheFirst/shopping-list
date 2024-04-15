module.exports = (request, response) => {
  switch (request.url) {
    case '/list':
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      console.group('FETCHED data', request.data);
      response.write(JSON.stringify(request.data));
      response.end();
      break;

    default:
      response.statusCode = 400;
      response.write(`CANNOT GET ${request.url}`);
      response.end();
  }
};
