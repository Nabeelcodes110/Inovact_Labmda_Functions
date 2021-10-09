const addIdea = `mutation add_idea($description: String!, $title:String!, $user_id:Int, $url:String!, ) {
  insert_idea(objects: [{
    description: $description,
    user_id: $user_id,
		title:$title,
		url:$url
  }]) {
    returning {
      id,
      title,
      description,
      url,
      user_id,
      created_at
      updated_at
    }
  }
}`;

module.exports = {
  addIdea,
};
