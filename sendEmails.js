function sendEmails() {
  var startPageSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('StartPage');
  var emailAddress = startPageSheet.getRange("C7").getValue();
    var message = 'The report is ready for viewing https://docs.google.com/spreadsheets/d/'+SpreadsheetApp.getActiveSpreadsheet().getId();
  var subject = "Sending emails from a Spreadsheet";
  MailApp.sendEmail(emailAddress, subject, message);
}
