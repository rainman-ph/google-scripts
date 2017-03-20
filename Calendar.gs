/**
 * An invalid date object returns NaN for getTime() and NaN is the only
 * object not strictly equal to itself.
 */
Date.prototype.isValidDate = function () {
    return this.getTime() === this.getTime();
};  


/**
 * Delete Google Calendar events from a given date range and title
 *
 * @param {number} input The value to multiply.
 * @return The input multiplied by 2.
 * @customfunction
 */
function deleteEvents(calendarName,sDate,tDate,objOptions)
{
  var fromDate = new Date(sDate);
  var toDate = new Date(tDate);

  if (!fromDate.isValidDate() || !toDate.isValidDate()) return -1;

  var calendar;
  if (calendarName=="")
    calendar = CalendarApp.getDefaultCalendar();
  else 
    calendar = CalendarApp.getCalendarsByName(calendarName)[0];

  var events = calendar.getEvents(fromDate, toDate,objOptions);
  for(var i=0; i<events.length;i++){
    var ev = events[i];
    Logger.log(ev.getTitle()); // show event name in log
    ev.deleteEvent();
    Utilities.sleep(100); 
  }
  return 0;
}


function testDeleteEvents (){
  var ret = deleteEvents("","1/1/2016","12/30/2018",{search: 'MPCWA'});
}