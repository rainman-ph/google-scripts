function createFilesInFolder() {

  //Open Folder
  var folder = DriveApp.getFolderById("0Bx_eNdwpfldWVEZZVEhfVmNkVnc");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var range = ss.getRangeByName("chapters");
  var numRows = range.getNumRows();
  var file = folder.getFilesByName("Template").next();
  
  for (var i = 1; i <= numRows; i++) {
    var strFileName = range.getCell(i,1).getDisplayValue()+" "+range.getCell(i,2).getValue()+" "+range.getCell(i,3).getValue();
    var url = "https://www.biblegateway.com/passage/?search="+range.getCell(i,2).getValue()+"+"+range.getCell(i,3).getValue()+"&version=NLT";
    if (folder.getFoldersByName(range.getCell(i,4).getValue()).hasNext())
       subfolder = folder.getFoldersByName(range.getCell(i,4).getValue()).next();
    else 
       subfolder =folder.createFolder(range.getCell(i,4).getValue());
    if (strFileName!="") {
      var newfile = file.makeCopy(strFileName,subfolder);
      var doc = DocumentApp.openById(newfile.getId());
      var par = doc.getBody().insertParagraph(0, url);
      par.setLinkUrl(url);
      doc.saveAndClose();
    }
  }
    
}