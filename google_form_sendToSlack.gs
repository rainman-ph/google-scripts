// Define global variable
var slackWebhookUrl = 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK/URL';

function onFormSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();
  var attachments = [];
  
  // Iterate through each form item response
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var item = itemResponse.getItem();
    var response = itemResponse.getResponse();
    
    // Skip empty form fields
    if (response !== '') {
      var responseString = response.toString();

      // Check if the form field is a file upload field
      if (item.getType() == FormApp.ItemType.FILE_UPLOAD) {
        var fileIds = responseString.split(",");
        var fileUrls = [];
        
        // Generate file URLs for each file ID
        for (var j = 0; j < fileIds.length; j++) {
          var fileId = fileIds[j].trim();
          var fileUrl = 'https://drive.google.com/file/d/' + fileId + '/view';
          fileUrls.push(fileUrl);
        }
        
        // Add file URLs as an attachment
        attachments.push({ 'title': item.getTitle(), 'text': fileUrls.join("\n") });
      } else {
        // Add non-file-upload form fields to the message text
        attachments.push({ 'title': item.getTitle(), 'text': responseString });
      }


    }
  }
  
  // Get submitter's email
  var respondentEmail = formResponse.getRespondentEmail();
  
  // Add respondent's email as an attachment
  attachments.push({ 'title': 'Submitter Email', 'text': respondentEmail });
  
  // Send the message to Slack
  sendToSlack(formResponse.getEditResponseUrl(), attachments);
  
  // Log form submission details
  Logger.log('Form submitted:');
  Logger.log('Form Edit URL: ' + formResponse.getEditResponseUrl());
  Logger.log('Attachments: ' + JSON.stringify(attachments));
}

function sendToSlack(formEditUrl, attachments) {
  var message = {
    'text': 'A new form submission has been received!',
    'attachments': attachments
  };
  
  var payload = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(message)
  };
  
  // Send the message to Slack using the Slack API
  UrlFetchApp.fetch(slackWebhookUrl, payload);
}
