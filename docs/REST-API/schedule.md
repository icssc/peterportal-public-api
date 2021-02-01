
## Schedule

### /schedule/soc

**GET schedule of classes data**

This API allows access to school, department, course, and section data in a hierarchical JSON format. It pulls information from the schedule of classes (WebSoc).

#### Parameters

!!! info
    Endpoint that utilize query params must follow by this format:
    `?key1=value1&key2=value2`

    `?` is use to start the query params string with &  to separate each param


!!! warning
    One problem with department such as I&C SCI and CRM/LAW, since the `&` and  `/` are reserved for URLs, you must use their URL encode representation.
    `I&C SCI` -> `I%26C SCI`
    `CRM/LAW` -> `CRM%2FLAW`

Descriptions found [here](https://www.reg.uci.edu/help/WebSoc-Glossary.shtml)

| Name             | Formatting                                                                                                                                                                                                                                                                                                                                                      | Notes                                                                                         |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| term             | [Year\] \['Fall'&#124;'Winter'&#124;'Spring'&#124;'Summer1'&#124;'Summer2'&#124;'Summer10wk'\]<br />Example: '2017 Fall' <br/> Default: ' '                                                                                                                                                                                                                     | Required. Schedule for your selected term must be available on WebSoc.                        |
| ge               |\['ANY'&#124;'GE-1A'&#124;'GE-1B'&#124;'GE-2'&#124;'GE-3'&#124;'GE-4'&#124;'GE-5A'&#124;'GE-5B'&#124;'GE-6'&#124;'GE-7'&#124;'GE-8'\]<br />Example: 'GE-1B' <br/> Default: ' '                                                                                                                                                                                   | Must specify at least one of department, GE, courseCodes, or instructorName                   |
| department       |List of available departments to search available in file depts.txt<br />Example: 'I&C SCI' <br/> Default: ' '                                                                                                                                                                                                                                                   | Must specify at least one of department, GE, courseCodes, or instructorName                   |
| courseNumber        |Any valid course number or range<br />Example: '32A' OR '31-33'  <br/> Default: ' '                                                                                                                                                                                                                                                                              |                                                                                               |
| division         |\['ALL'&#124;'LowerDiv'&#124;'UpperDiv'&#124;'Graduate'\]<br />Example: 'LowerDiv' <br/> Default: 'ALL'                                                                                                                                                                                                                                                          |                                                                                               |
| sectionCodes      |Any valid 5-digit course code or range<br />Example: "36531" OR "36520-36536" <br/> Default: ' '                                                                                                                                                                                                                                                                 | Must specify at least one of department, GE, courseCodes, or instructorName                   |
| instructorName   |Any valid instructor last name or part of last name<br />Example: 'Thornton' <br/> Default: ' '                                                                                                                                                                                                                                                                  | Enter last name only                                                                          |
| courseTitle      |Any text<br />Example: 'Intro' <br/> Default: ' '                                                                                                                                                                                                                                                                                                                |                                                                                               |
| sectionType        |\['ALL'&#124;'ACT'&#124;'COL'&#124;'DIS'&#124;'FLD'&#124;'LAB'&#124;'LEC'&#124;'QIZ'&#124;'RES'&#124;'SEM'&#124;'STU'&#124;'TAP'&#124;'TUT'\]<br />Example: 'LAB'  <br/> Default: 'ALL'                                                                                                                                                                          |                                                                                               |
| units            |Any integer or decimal with only tenths place precision, or 'VAR' to look for variable unit classes only.<br />Example: '5' OR '1.3' <br/> Default: ' '                                                                                                                                                                                                          |                                                                                               |
| days             |\['M'&#124;'T'&#124;'W'&#124;'Th'&#124;'F'\] or a combination of these days<br />Example: 'T' OR 'MWF' <br/> Default: ' '                                                                                                                                                                                                                                        |                                                                                               |
| startTime        |Any time in 12 hour format<br />Example: '10:00AM' OR '5:00PM' <br/> Default: ' '                                                                                                                                                                                                                                                                                | Only enter sharp hours                                                                        |
| endTime          |Any time in 12 hour format<br />Example: '12:00AM' OR '6:00PM' <br/> Default: ' '                                                                                                                                                                                                                                                                                | Only enter sharp hours                                                                        |
| maxCapacity           |Exact number like '300' or modified with '<' or '>' to indicate less than specified or greater than specified.<br />Example: '>256' OR '19' OR '<19' <br/> Default: ' '                                                                                                                                                                                          |                                                                                               |
| fullCourses      |\['ANY'&#124;'SkipFullWaitlist'&#124;'FullOnly'&#124;'OverEnrolled'\] <br />'SkipFullWaitlist' means that full courses will be included if there's space on the wait-list <br />'FullOnly' means only full courses will be retrieved <br />'OverEnrolled' means only over-enrolled courses will be retrieved<br />Example:'SkipFullWaitlist' <br/> Default: 'ANY'|                                                                                               |
| cancelledCourses |\['Exclude'&#124;'Include'&#124;'Only'\]<br />Example: 'Include' <br/> Default: 'EXCLUDE'                                                                                                                                                                                                                                                                        |                                                                                               |
| building         |Any valid building code<br />Example: 'DBH' <br/> Default: ' '                                                                                                                                                                                                                                                                                                   | The value is a building code. Building codes found here: https://www.reg.uci.edu/addl/campus/ |
| room             |Any valid room number<br />Example: '223' <br/> Default: ' '                                                                                                                                                                                                                                                                                                     | You must specify a building code if you specify a room number                                 |



!!! tip 
    **All params are optional and multiple can be included by using ; as a separator.**

    i.e. `key1=value1;value2&key2=value2`

!!! tip
    The more you narrow down your query, the faster the response! 🏃‍♀️💨 😎

#### Response

| Code | Description |
|------|-------------|
| `200` | A list of JSON object results containing the course info, count of each grades, and average GPA |
| `400` | Invalid parameter syntax. |



This endpoint is based off of this [npm package](https://github.com/icssc-projects/websoc-api).