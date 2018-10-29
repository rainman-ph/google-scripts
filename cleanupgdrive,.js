//https://stackoverflow.com/questions/28618964/apps-script-automatically-delete-files-from-google-drive-older-than-3-days-g
function getFilesOlderBy(daysOld) {
  var arrayOfFileIDs = [];

  var ThirtyDaysBeforeNow = new Date().getTime()-3600*1000*24*daysOld;
    // daysOld is the number of days 
    //(3600 seconds = 1 hour, 1000 milliseconds = 1 second, 24 hours = 1 day and daysOld days is the duration you wanted
    //needed in yr-month-day format

  var cutOffDate = new Date(ThirtyDaysBeforeNow);
  var cutOffDateAsString = Utilities.formatDate(cutOffDate, "GMT", "yyyy-MM-dd");
  //Logger.log(cutOffDateAsString);

  var theFileID = "";

  //Create an array of file ID's by date criteria
  var files = DriveApp.searchFiles(
     'modifiedDate < "' + cutOffDateAsString + '"');

  while (files.hasNext()) {
    var file = files.next();
    theFileID = file.getId();

    arrayOfFileIDs.push(theFileID);
    //Logger.log('theFileID: ' + theFileID);
    //Logger.log('date last updated: ' + file.getLastUpdated());
  }

  return arrayOfFileIDs;
  //Logger.log('arrayOfFileIDs: ' + arrayOfFileIDs);
};

function purgeFile(fileIDToDelete) {
  //This deletes (purge) a file without needing to move it to the trash
  var rtrnFromDLET = Drive.Files.remove(fileIDToDelete);
}

function deleteFilesOlderBy(daysOld) {
  var arrayIDs = getFilesOlderBy(daysOld);

  for (var i=0; i < arrayIDs.length; i++) {
    Logger.log('arrayIDs[i]: ' + arrayIDs[i]);
    purgeFile(arrayIDs[i]);
  }
};
