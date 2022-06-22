function cleanNotificationDoc(notificationDoc) {
  let res = notificationDoc.notification_object;

  res['actor'] = res.notification_changes[0].user;

  delete res.notification_changes;

  return res;
}

module.exports = cleanNotificationDoc;
