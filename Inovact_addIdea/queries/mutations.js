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

const addTags = `mutation addIdea($objects: [idea_tag_insert_input!]!) {
  insert_idea_tag(objects: $objects) {
    returning {
      idea_id
      tag_id
    }
  }
}`;

const addDocuments = `mutation addDocuments($objects: [idea_documents_insert_input!]!) {
  insert_idea_documents(objects: $objects) {
    returning {
      id
    }
  }
}`;

module.exports = {
  addIdea,
  addTags,
  addDocuments,
};
