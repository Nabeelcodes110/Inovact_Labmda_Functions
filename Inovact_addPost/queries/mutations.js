const addPost = `mutation add_project($description: String!, $title:String!, $user_id:Int) {
  insert_project(objects: [{
    title:$title
    description: $description
    user_id: $user_id
  }]) {
    returning {
      id,
      title,
      description,
      status,
      mentions,
      looking_for_roles,
      team_id,
      completed,
      created_at,
      updated_at
    }
  }
}`;

module.exports = {
  addPost,
};
