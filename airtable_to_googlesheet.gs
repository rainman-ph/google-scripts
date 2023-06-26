// Replace with your Airtable API credentials
var airtableApiKey = 'YOUR_AIRTABLE_API_KEY';
var airtableBaseId = 'YOUR_AIRTABLE_BASE_ID';
var airtableTableName = 'YOUR_AIRTABLE_TABLE_NAME';

// Replace with your Google Drive folder ID
var folderId = 'YOUR_GOOGLE_DRIVE_FOLDER_ID';

function importAirtableData() {
  var airtableUrl = 'https://api.airtable.com/v0/' + airtableBaseId + '/' + airtableTableName;
  
  var headers = {
    'Authorization': 'Bearer ' + airtableApiKey
  };
  
  var options = {
    'headers': headers,
    'muteHttpExceptions': true
  };
  
  var response = UrlFetchApp.fetch(airtableUrl, options);
  var data = JSON.parse(response.getContentText());
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = data.records;
  
  // Populate headers
  var headers = data.fields;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Populate data
  var values = [];
  
  for (var i = 0; i < rows.length; i++) {
    var fields = rows[i].fields;
    var row = [];
    
    for (var j = 0; j < headers.length; j++) {
      var fieldName = headers[j];
      
      // Handle image fields separately
      if (fieldName === 'Image') {
        var image = fields[fieldName];
        
        if (image && image[0]) {
          var imageUrl = image[0].url;
          var imageName = image[0].filename;
          var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
          var folder = DriveApp.getFolderById(folderId);
          var file = folder.createFile(imageBlob);
          var fileUrl = file.getUrl();
          
          row.push(fileUrl);
        } else {
          row.push('');
        }
      } else {
        row.push(fields[fieldName]);
      }
    }
    
    values.push(row);
  }
  
  // Populate data in the sheet
  sheet.getRange(2, 1, values.length, headers.length).setValues(values);
}
