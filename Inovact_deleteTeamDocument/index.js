const axios = require('axios');
const { query: Hasura } = require("./utils/hasura");
const { delete_team_documents} = require("./queries/queries");

exports.handler = async (events, context, callback) => {
     
      const id = await events.id;
      
      
          const variable = {
      id,
    };

   
     const  response = await Hasura(delete_team_documents,variable);
     
      if (response.success) {
    callback(null, response.result);
  } else {
    callback(null, response.errors);
  }
     

 

   
}
        
  
