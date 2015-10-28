function populateData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var fromS1 = ss.getSheetByName('Sheet1');
  var fromS2 = ss.getSheetByName('Sheet2');
  var toS = ss.getSheetByName('Sheet3');

  var fromS1row = fromS1.getLastRow();
  var fromS2row = fromS2.getLastRow();
  var fromS2col = fromS2.getLastColumn();
  var toSlastrow = 2;
  
  
  //Browser.msgBox('fromS2col='+fromS2col, Browser.Buttons.OK); 
  
  toS.clearContents();
  
  //Copy Columns labels
  fromS1.getRange(1,1).copyTo(toS.getRange(1,1));
  fromS2.getRange(1,1,1,fromS2col).copyTo(toS.getRange(1,2));
  for (var r1 = 2; r1<= fromS1row; r1++){
     
    //Populate to sheet with patient data
    fromS1.getRange(r1,1).copyTo(toS.getRange(toSlastrow,1,fromS2row), {contentsOnly:true});
    
    //Populate the rest of the column of toSheet with fromS2
    fromS2.getRange(2,1,fromS2row,fromS2col).copyTo(toS.getRange(toSlastrow,2,fromS2row));
    
    toSlastrow = toS.getLastRow();
  }
    
}
