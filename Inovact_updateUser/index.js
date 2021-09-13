exports.handler = (events, context, callback) => {

  
  const response = {
    statusCode: 200,
    body: events,
  };
  
  callback(null, response);
}