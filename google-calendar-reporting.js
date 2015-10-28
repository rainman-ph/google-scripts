/////////////////////////////////
// Author: RCasumpang
// Date : 2015-10-26
// Reference: http://www.mousewhisperer.co.uk/drivebunny/export-from-calendar-to-sheet-using-apps-script/
// History:
//   2015-10-26 Initial Version
//   2015-10-27 Version 1.0
//
/////////////////////////////////
function getLeaves() {
 var mycal = "<calendarid>@resource.calendar.google.com"; // change to suit
 
 var cal = CalendarApp.getCalendarById(mycal);
 
 //
 var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');
 var startPageSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('StartPage');
 var now = getRelativeDate(0,23);
 var tomorrow = getRelativeDate(1,23);
 var startYear = startPageSheet.getRange("C3").getValue();
 var endYear  = startPageSheet.getRange("C4").getValue();
 var user = Session.getActiveUser().getEmail();
 
 if (null==dataSheet){
    dataSheet=SpreadsheetApp.getActiveSpreadsheet().insertSheet('Data');
 }
 dataSheet.clearContents(); 
 
 //Get the events (use your own dates and keywords, or pass them as arguments):

 //Headers
 var details=[["Requestor", "Title", "Description", "Start", "End","Type","Days"]];

 var currentRow=2;
 var range=dataSheet.getRange(1,1,1,7);
 range.setValues(details);
 
 //Filter out filed Sick leave
 currentRow=populateVacation(cal,dataSheet,'-sick',currentRow,startYear,now,'VL-Today');
 currentRow=populateVacation(cal,dataSheet,'-sick',currentRow,tomorrow,endYear,'VL-Future');
 //Search only for filed Sick leave
 currentRow=populateVacation(cal,dataSheet,'sick',currentRow,startYear,now,'SL');
 
 //Update the Last Run informations
 startPageSheet.getRange("C5").setValue(new Date());
 startPageSheet.getRange("C6").setValue(user);


}

function populateVacation(calendar,sheet,searchStr,currentRow,startDate,endDate,leaveType)
{
   var events = calendar.getEvents(startDate,endDate,{search: searchStr});
   //Then loop through and write out (choose your own calendar fields, I've used just five):
   for (var j=0;j<events.length;j++,currentRow++) {
     var details=[[events[j].getOriginalCalendarId(), events[j].getTitle(), events[j].getDescription(), events[j].getStartTime(), events[j].getEndTime(),leaveType]];
     var range=sheet.getRange(currentRow,1,1,6);
     range.setValues(details);     
     var cell = sheet.getRange("G"+(currentRow));
     cell.setFormula("=NETWORKDAYS(D"+(currentRow)+",E"+(currentRow)+",StartPage!C10:C30)");
   }
   return currentRow;
}

function getRelativeDate(daysOffset, hour) {
  var date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function backupData(){
 //
 var bakDate = new Date();
 var bakName = 'Data:'+bakDate.toDateString();
 var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');
 var newSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(bakName);
 if (null!=newSheet)
    SpreadsheetApp.getActiveSpreadsheet().deleteSheet(newSheet);
 newSheet = dataSheet.copyTo(SpreadsheetApp.getActiveSpreadsheet());
 newSheet.setName(bakName);
}

// Add a custom menu to a spreadsheet.
function onOpen() {
 // create a variable 'sheet' that references the current spreadsheet:
 var sheet = SpreadsheetApp.getActiveSpreadsheet();

 // make a new array 'menuItems' to store the items in the custom menu:
 var menuItems = [];

 // Define the new menu items:
 menuItems.push({name: "Leave Report", functionName: "getLeaves"});
 menuItems.push({name: "Backup Data", functionName: "backupData"});

 // add hem to the menu
 sheet.addMenu("Report", menuItems);
}
