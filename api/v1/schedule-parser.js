function ParsedCourseTime(timeString) {
    /*
    Used to parse the horribly inconsistent time string formats
  
    Assumptions:
    1. earliest possible course time is 6am
    2. latest possible course time is 9pm
    3. course durations never exceed 5 hours
    Acceptable Inputs:
    valid start hours        6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9
    valid start am hours     6,7,8,9,10,11
    valid start pm hours                   12,1,2,3,4,5,6,7,8,9
    valid end hours            7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10
    valid end am hours         7,8,9,10,11
    valid end pm hours                     12,1,2,3,4,5,6,7,8,9,10
  
    no +12h                                12
  
    Input: "Th &nbsp; 12:30-12:50p "
    */
    var MAX_DURATION = 5;
  
    var dashedSplit = timeString.split("-"); // ex. ["Th &nbsp; 12:30", "12:50p "]
    var dayBeginSplit = dashedSplit[0].split("&nbsp;"); // ex. ["Th ", " 12:30"]
  
    var beginTime = dayBeginSplit[dayBeginSplit.length - 1].trim(); // ex. "6:00"
    var endTime = dashedSplit[1].trim(); // "6:50p"
  
    var beginHour = parseInt(beginTime.split(":")[0]);
    var beginMin = parseInt(beginTime.split(":")[1]);
  
    var endHour = parseInt(endTime.split(":")[0]);
    var endMin = parseInt(endTime.split(":")[1].replace("p", ""));
    var isPm = endTime.indexOf("p") != -1;
  
    if (isPm) {
      var military = endHour == 12 ? 12 : endHour + 12;
      if (military - beginHour > MAX_DURATION) {
        beginHour += 12;
      }
      if (endHour != 12) {
        endHour += 12;
      }
    }
  
    // Ensures that minutes is always two digits
    // beginHour + ':' + ("0" + beginMin).slice(-2)
    return {
      beginHour: beginHour,
      beginMin: beginMin,
      endHour: endHour,
      endMin: endMin,
      sessionDuration: (endHour - beginHour) * 60 + endMin - beginMin
    };
  }
  
function ParsedSectionsByDay(scheduleJson) {
    var courseSections = { M: [], Tu: [], W: [], Th: [], F: [] }
  
    for (var s in scheduleJson.schools[0].departments[0].courses[0].sections) {
      var sections = scheduleJson.schools[0].departments[0].courses[0].sections[s];

      for (var m in sections.meetings) {
        var meeting = sections.meetings[m];

        Object.keys(courseSections).forEach(day => {
            if (new RegExp(day).test(meeting.days)) {
                courseSections[day].push({
                  sectionCode: sections.sectionCode,
                  maxCapacity: sections.maxCapacity,
                  numCurrentlyEnrolled: sections.numCurrentlyEnrolled.totalEnrolled,
                  sectionType: sections.sectionType,
                  instructors: sections.instructors,
                  sectionNum: sections.sectionNum,
                  bldg: meeting.bldg,
                  time: ParsedCourseTime(meeting.time)
                });
              }
        })
      }
    }

  return courseSections;
  };

module.exports = { ParsedSectionsByDay }