const addNotificationObject = `mutation addNotificationObject($notification_objects: [notification_object_insert_input!]!) {
  insert_notification_object(objects: $notification_objects) {
    returning {
      id
    }
  }
}`;

module.exports = {
  addNotificationObject,
};
