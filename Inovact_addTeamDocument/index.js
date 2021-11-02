const { query: Hasura } = require('./utils/hasura');
const { add_TeamDocument} = require('./queries/mutations');
const { getUserId, getTeamDocument,getTeamUserId } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success) callback(null, response1.errors);
  if (response1.result.data.user.length == 0) callback('User not found');
  
  //getTeamUserId
  const variable = {
    team_id: events.team_id
    
    
  };
  
  //getTeamuserId
  const response = await Hasura(getTeamUserId, variable);
 if (!response.success) callback(null, response.errors);
 
  if(response.result.data.team_members[0].user_id==response1.result.data.user[0].id){
    
     const teamDocumentData = {
    team_id: events.team_id,
    mime_type:events.mime_type,
    name:events.name,
    url:events.url
    
  };

  const response2 = await Hasura(add_TeamDocument, teamDocumentData);

  // If failed to insert thought return error
  if (!response2.success) return callback(null, response2.errors);

  

   
  // Fetch the thought in final stage
  const variables = {
    id: response2.result.data.insert_team_documents.returning[0].id,
  };

  const response5 = await Hasura(getTeamDocument, variables);

  if (!response5.success) callback(null, response5.errors);

  callback(null, response5.result);
    
  }else{
    callback(null,{
      message: "Invalid or id not found",
    });
  }

 
};
