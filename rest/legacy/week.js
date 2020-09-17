var fetch = require("node-fetch");
const cheerio = require('cheerio');
var {getKey} = require("./cache_v2")

function getWeek(req, res) {
    // current date
    let date = new Date(Date.now());
    // current year
    let year = date.getFullYear();
    // check for current year to current year + 1
    getQuarterMapping(year, (quarterMapping1) => {
        let potentialWeek = findWeek(date, quarterMapping1);
        // if the date lies within this page
        if(potentialWeek){
            res.send(potentialWeek);
        }
        else{
            // check for current year - 1 to current year
            getQuarterMapping(year - 1, (quarterMapping2) => {
                potentialWeek = findWeek(date, quarterMapping2);
                if(potentialWeek){
                    res.send(potentialWeek);
                }
                else{
                    // date not in any school term, probably in break
                    res.send("Enjoy your break!");
                }
            })
        }
    })
}

// date: current date
// quarterMapping: the quarterMapping
// returns the week description if it lies within the quarter mapping
function findWeek(date, quarterMapping)
{
    let result = undefined;
    // iterate through each quarter
    Object.keys(quarterMapping).forEach(function(quarter) {
        let begin = new Date(quarterMapping[quarter]["begin"])
        let end = new Date(quarterMapping[quarter]["end"])
        // check if the date lies within the start/end range
        if(date >= begin && date <= end)
        {
            result = `Week ${Math.floor(dateSubtract(begin, date) / 7) + 1}, ${quarter}`
        }
        // check if date is 1 week after end
        else if(date > end && date <= end.addDays(7)){
            result = `Finals Week, ${quarter}. Good Luck!🤞`
        }
    });
    return result;
}

// year: the academic year to search for
// callback: passes in the quarter mapping to callback
// quarterMapping: {quarter:{start:Date, end:Date}}
// given a year, get quarter to date range mapping
async function getQuarterMapping(year, callback)
{
    // check if is in the cache
    let cacheKey = `quarterMapping${year}`
    let cacheValue = getKey(cacheKey)
    if(cacheValue){
        callback(cacheValue);
        return;
    }
    // maps quarter description to day range
    let quarterToDayMapping = {}
    // url to academic calendar
    let url = `https://reg.uci.edu/calendars/quarterly/${year}-${year+1}/quarterly${year%100}-${(year%100)+1}.html`
    let res = await fetch(url);
    let text = await res.text();
    // scrape the calendar
    let $ = cheerio.load(text);
    // load all tables on the page
    let tables = $('table[class="calendartable"]').toArray()
    // process each table
    tables.forEach(table => {
        processTable(table, $, quarterToDayMapping, year);
    })
    // setKey(cacheKey, quarterToDayMapping);
    // invoke the callback
    callback(quarterToDayMapping);
}

// finds the table labels and process each row
// table: the cherio table element
// $: cherio command
// quarterToDayMapping: the mapping to store data into
// year: the beginning academic year
// finds and assigns the beginning and end date for a table
function processTable(table, $, quarterToDayMapping, year)
{
    // find the tbody
    let tbody = $(table).find('tbody')
    // reference all rows in the table
    let rows = tbody.find("tr").toArray()
    // the first row has all the labels for the table
    let tableLabels = $(rows[0]).find("td").toArray()
    rows.forEach(row => {
        // process each row
        processRow(row, $, quarterToDayMapping, tableLabels, year)
    })
}

// process a row
// row: the cherio row element
// $: cherio command
// quarterToDayMapping: the mapping to store data into
// tableLabels: the cherio table label element
// year: the beginning academic year
// checks if is a row is a beginning or end date
function processRow(row, $, quarterToDayMapping, tableLabels, year){
    // get all information from row
    let rowInfo = $(row).find("td").toArray()
    // start date
    if($(rowInfo[0]).text() == "Instruction begins")
    {
        // for each season
        for(let i = 1; i < 4; i++)
        {
            let dateEntry = $(rowInfo[i]).text()
            let dateLabel = strip($(tableLabels[i]).text());
            quarterToDayMapping[dateLabel] = {"begin":processDate(dateEntry, dateLabel, year)};
        }
    }
    // end date
    else if($(rowInfo[0]).text() == "Instruction ends")
    {
        // for each season
        for(let i = 1; i < 4; i++)
        {
            let dateEntry = $(rowInfo[i]).text()
            let dateLabel = strip($(tableLabels[i]).text());
            quarterToDayMapping[dateLabel]["end"] = processDate(dateEntry, dateLabel, year);
        }
    }
}

// dateEntry: a date entry on the calendar (eg. Jan 17)
// dateLabel: a date label on the calendar (eg. Winter 2020 or Summer Session 10WK)
// year: the beginning academic year (eg. 2019)
// returns a Date for the corresponding table entry
function processDate(dateEntry, dateLabel, year){
    splitDateEntry = dateEntry.split(" ");
    let month = splitDateEntry[0];
    let day = splitDateEntry[1];
    let labelYear = dateLabel.split(" ")[1];
    correctYear = isInteger(labelYear) ? labelYear : year + 1;            
    return new Date(`${month}/${day}/${correctYear}`)
}

// helper functions
function strip(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

function isInteger(num){
    return !isNaN(parseInt(num, 10))
}

// get the number of days between two dates
function dateSubtract(date1, date2)
{
    // To calculate the time difference of two dates 
    let Difference_In_Time = date2.getTime() - date1.getTime(); 
    // To calculate the no. of days between two dates 
    return Difference_In_Time / (1000 * 3600 * 24); 
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

module.exports = getWeek;