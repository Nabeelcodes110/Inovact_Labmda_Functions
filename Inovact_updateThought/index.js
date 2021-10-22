const axios = require('axios');
const { query: Hasura } = require("./utils/hasura");
const { updateThought_query,getUserId,getThoughtUserId } = require("./queries/queries");

exports.handler = async (events, context, callback) => {
    
    // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });
  
  if (!response1.success) return callback(null, response1.errors);
   
   
     
      const id = await events.id;
          const variable = {
      id,
    };

    const response2 = await Hasura(getThoughtUserId, variable);

    if (!response2.success) return callback(null, response2.errors);
  
 
    //check current user
    if(response2.result.data.thoughts[0].user_id==response1.result.data.user[0].id){
     let variables = await {
    id: {
      _eq: events.id,
    },
    changes: {},
  };

 if (events.thought) variables['changes']['thought'] = events.thought;
 
     const  response = await Hasura(updateThought_query,variables);
     
      if (response.success) {
    callback(null, response.result);
  } else {
    callback(null, response.errors);
  }
        
        
        
}else{
   callback({
      message: "Invalid or id not found",
    });
}
        
       
 
 

 
        
  
    
  
      
      
   
  
  

 
};
