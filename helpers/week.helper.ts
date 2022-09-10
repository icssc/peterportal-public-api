import cheerio from "cheerio";
import fetch from "node-fetch";

/**
 * Get the current week and quarter. A display string is also provided.
 */
function getWeek(yearInput: string, month: string, day: string) {
  return new Promise(async (resolve, reject) => {
    let date;
    if (!yearInput || !month || !day) {
      //if all are empty
      if (!yearInput && !month && !day) {
        date = new Date(Date.now());
      }
      //if one of year/month/day is missing
      else {
        reject(new Error());
        return;
      }
    }
    //if none of year/month/day are missing
    else {
      //validate year, month, day
      if (
        typeof yearInput != "string" ||
        typeof month != "string" ||
        typeof day != "string" ||
        yearInput.length != 4 ||
        month.length != 2 ||
        day.length != 2
      ) {
        reject(new Error());
        return;
      }
      const dateString = yearInput + "/" + month + "/" + day;
      date = new Date(dateString);
      if (isNaN(date)) {
        reject(new Error());
        return;
      }
    }

    const year = date.getFullYear();
    // check for current year to current year + 1
    const quarterMapping1 = await getQuarterMapping(year);
    let potentialWeek = findWeek(date, quarterMapping1);
    // if the date lies within this page
    if (potentialWeek) {
      resolve(potentialWeek);
      return;
    }
    // check for current year - 1 to current year
    const quarterMapping2 = await getQuarterMapping(year - 1);
    potentialWeek = findWeek(date, quarterMapping2);
    if (potentialWeek) {
      resolve(potentialWeek);
    } else {
      // date not in any school term, probably in break
      resolve({
        week: -1,
        quarter: "N/A",
        display: "Enjoy your break!😎",
      });
    }
  });
}
/**
 *
 * @param date Today's date
 * @param quarterMapping Maps a quarter to its start and end date
 * @returns Week description if it lies within the quarter
 */
function findWeek(date, quarterMapping) {
  let result = undefined;
  // iterate through each quarter
  Object.keys(quarterMapping).forEach(function (quarter) {
    const begin = new Date(quarterMapping[quarter]["begin"]);
    const end = new Date(quarterMapping[quarter]["end"]);
    // check if the date lies within the start/end range
    if (date >= begin && date <= end) {
      const week = Math.floor(dateSubtract(begin, date) / 7) + 1;
      const display = `Week ${week} • ${quarter}`;
      result = {
        week: week,
        quarter: quarter,
        display: display,
      };
    }
    // check if date is 1 week after end
    else if (date > end && date <= addDays(end, 7)) {
      const display = `Finals Week • ${quarter}. Good Luck!🤞`;
      result = {
        week: -1,
        quarter: quarter,
        display: display,
      };
    }
  });
  return result;
}

/**
 * Given a year, get quarter to date range mapping
 * @param year Academic year to search for
 * @returns Mapping of quarters to its start and end date
 */
async function getQuarterMapping(year) {
  return new Promise(async (resolve) => {
    // maps quarter description to day range
    const quarterToDayMapping = {};
    // url to academic calendar
    const currYear = year % 100;
    const nextYear = (year % 100) + 1;

    const currYearString = currYear.toString().padStart(2, "0");
    const nextYearString = nextYear.toString().padStart(2, "0");

    const url = `https://reg.uci.edu/calendars/quarterly/${year}-${
      year + 1
    }/quarterly${currYearString}-${nextYearString}.html`;
    const res = await fetch(url);
    const text = await res.text();
    // scrape the calendar
    const $ = cheerio.load(text);
    // load all tables on the page
    const tables = $('table[class="calendartable"]').toArray();

    // process each table
    tables.forEach((table) => {
      processTable(table, $, quarterToDayMapping, year);
    });
    //await setValue(COLLECTION_NAMES.SCHEDULE, cacheKey, quarterToDayMapping);
    resolve(quarterToDayMapping);
    return;
  });
}

/**
 * Parses the quarter names from table labels and processes each row to find the start and end dates
 * @param table Cherio table element
 * @param $ Cherio command
 * @param quarterToDayMapping Mapping to store data into
 * @param year Beginning academic year
 */
function processTable(table, $, quarterToDayMapping, year) {
  // find the tbody
  const tbody = $(table).find("tbody");
  // reference all rows in the table
  const rows = tbody.find("tr").toArray();
  // the first row has all the labels for the table
  const tableLabels = $(rows[0]).find("td").toArray();
  rows.forEach((row) => {
    // process each row
    processRow(row, $, quarterToDayMapping, tableLabels, year);
  });
}

/**
 * Checks if a row contains info on beginning or end date
 * @param row Cherio row element
 * @param $ Cherio command
 * @param quarterToDayMapping Mapping to store data into
 * @param tableLabels Column labels in the current table
 * @param year Beginning academic year
 */
function processRow(row, $, quarterToDayMapping, tableLabels, year) {
  // get all information from row
  const rowInfo = $(row).find("td").toArray();
  // start date
  if ($(rowInfo[0]).text() == "Instruction begins") {
    // for each season
    for (let i = 1; i < 4; i++) {
      const dateEntry = $(rowInfo[i]).text();
      const dateLabel = strip($(tableLabels[i]).text());
      quarterToDayMapping[dateLabel] = {
        begin: processDate(dateEntry, dateLabel, year),
        end: new Date(),
      };
    }
  }
  // end date
  else if ($(rowInfo[0]).text() == "Instruction ends") {
    // for each season
    for (let i = 1; i < 4; i++) {
      const dateEntry = $(rowInfo[i]).text();
      const dateLabel = strip($(tableLabels[i]).text());
      quarterToDayMapping[dateLabel]["end"] = processDate(
        dateEntry,
        dateLabel,
        year
      );
    }
  }
}

/**
 * Form a date object based on data from the calendar
 * @example
 * // returns Date(1/17/2020)
 * processDate('Jan 17', 'Winter 2020', 2019)
 * @example
 * // returns Date(7/30/2021)
 * processDate('July 30', 'Summer Session 10WK', 2020)
 * @param dateEntry Date entry on the calendar
 * @param dateLabel Date label on the calendar
 * @param year Beginning academic year
 * @returns Date for the corresponding table entry
 */
function processDate(dateEntry, dateLabel, year) {
  const splitDateEntry = dateEntry.split(" ");
  const month = splitDateEntry[0];
  const day = splitDateEntry[1];
  const labelYear = dateLabel.split(" ")[1];
  // 'Winter 2020' => 2020, but 'Summer Session I' => Session
  // Exception for Summer Session
  const correctYear = isInteger(labelYear) ? labelYear : year + 1;
  return new Date(`${month}/${day}/${correctYear}`);
}

/**
 * Remove trailing/leading whitespace from string
 * @param str Original string
 * @returns New string with whitespace removed
 */
function strip(str) {
  return str.replace(/^\s+|\s+$/g, "");
}

/**
 * Determine if a number is an integer or not
 * @param num Number to test
 * @returns True if is an integer
 */
function isInteger(num) {
  return !isNaN(parseInt(num, 10));
}

/**
 * Get the number of days between two dates
 * @param date1 Earlier date
 * @param date2 Later date
 * @returns Number of days between date1 and date2
 */
function dateSubtract(date1, date2) {
  // To calculate the time difference of two dates
  const Difference_In_Time = date2.getTime() - date1.getTime();
  // To calculate the no. of days between two dates
  return Difference_In_Time / (1000 * 3600 * 24);
}

/**
 * Add days to a date
 * @param date Date to add days to
 * @param days Number of days to add
 * @returns Same date as the one passed in
 */
function addDays(date, days) {
  date.setDate(date.getDate() + days);
  return date;
}

export { getWeek };
