const addNotifications = `mutation addNotifications($objects: [notification_object_insert_input!]!){
  insert_notification_object(objects: $objects) {
    returning {
      id
    }
  }
}`;

module.exports = {
  addNotifications,
};
