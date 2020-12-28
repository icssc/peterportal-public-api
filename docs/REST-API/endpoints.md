# Endpoints

## Courses

**📚 Find information on UC Irvine courses here**

### `/courses/all`

**GET all courses**

| Code | Description |
|------|-------------|
| `200` | A list of all courses available on the UCI Catalogue. Each element is a JSON object containing information on each course (department, number, title, and description) |

??? example "200 Successful Response"

    ``` JSON
    [
      ...
      {
        "department": "I&C SCI",
        "number": "51",
        "title": "Introductory Computer Organization",
        "description": "Multilevel view of system hardware and software..."
      },
      ...
    ]
    ```

### `/courses/{courseID}`

**GET detailed information on a specific course**

#### Parameters

| Parameter | Description | Example |
|------|-------------|---------|
| `courseID` | Course department + course number (without spaces) | I&CSCI53, COMPSCI122B, BIOSCI43 |

#### Responses

| Code | Description |
|------|-------------|
| `200` |  A JSON object containing every information available on a specific course. |
| `404` | Invaild ID/Course not found |


??? example "200 Successful Response"

    <!-- `/courses/I&CSCI53` returns -->

    ``` JSON
    {
        "id": "I&C SCI 53",
        "department": "I&C SCI",
        "number": "53",
        "school": "Donald Bren School of Information and Computer Sciences",
        "title": "Principles in System Design",
        "course_level": "Lower Division (1-99)",
        "department_alias": [
            "ICS"
        ],
        "units": [
            4,
            4
        ],
        "description": "Introduces basic principles of system software: operating systems, compilers, and networking. Exposure to the following topics through theoretical and practical programming experiences: linking and loading, process and memory management, concurrency and synchronization, network communication, programming for performance, etc.",
        "department_name": "Information and Computer Science",
        "professor_history": [
            "iharris",
            "klefstad",
            "jwongma"
        ],
        "prerequisite_tree": "{\"AND\":[\"I&C SCI 51\"]}",
        "prerequisite_list": [
            "I&C SCI 51"
        ],
        "prerequisite_text": "I&C SCI 51",
        "dependencies": [
            "COMPSCI 122C",
            "COMPSCI 131",
            "COMPSCI 222",
            "I&C SCI 53L"
        ],
        "repeatability": "",
        "grading_option": "",
        "concurrent": "",
        "same_as": "",
        "restriction": "",
        "overlap": "",
        "corequisite": " I&C SCI 53L",
        "ge_list": [],
        "ge_text": "",
        "terms": [
            "2019 Spring",
            "2020 Fall",
            "2019 Fall",
            "2019 Winter",
            "2018 Winter",
            "2018 Spring",
            "2017 Winter",
            "2017 Spring"
        ]
    }
    ```
    
??? example "404 Not Found"

    `/courses/I&CSCI5555` returns

    ``` JSON
    {
        "timestamp": "Thu, 31 Dec 2020 00:00:00 GMT",
        "status": 404,
        "error": "Bad Request: Invalid parameter", 
        "message": "Course not found",
    }
    ```

## Instructors

**👩‍🏫 Find information on UCI instructors here.**

### `/instructors/all`

**GET all instructors**

#### Parameters

None. 💃

#### Responses
| Code | Description |
|------|-------------|
| `200` | A list of all instructors available on the UCI Catalogue. Each element is a JSON object containing information on each instructor (name, ucinetid, title, department). |

??? example "200 Successful Response"

    ``` JSON
    [
      ...
      {
          "name": "Michael Shindler",
          "ucinetid": "mikes",
          "title": "Assistant Professor of Teaching",
          "department": "Computer Science"
      },
      ...
    ]
    ```

### /instructors/{ucinetid}

**GET detailed information on a specific instructor**

#### Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `ucinetid` | Can be obtained using the /all endpoint above |  |

#### Responses

| Code | Description |
|------|-------------|
| `200` | A JSON object containing every information available on a specific instructor |
| `404` | Invaild UCInetID/Instructor not found |

??? example "200 Succesful Response"

    `/instructors/mikes` returns

    ``` JSON
    {
        "name": "Michael Shindler",
        "ucinetid": "mikes",
        "phone": "",
        "title": "Assistant Professor of Teaching",
        "department": "Computer Science",
        "schools": [
            "Donald Bren School of Information and Computer Sciences"
        ],
        "related_departments": [
            "COMPSCI",
            "IN4MATX",
            "I&C SCI",
            "SWE",
            "STATS"
        ],
        "course_history": [
            "COMPSCI 199",
            "COMPSCI H198",
            "I&C SCI 46",
            "COMPSCI 167",
            "COMPSCI 161",
            "COMPSCI 269S",
            "COMPSCI 260P",
            "COMPSCI 162"
        ]
    }
    ```

??? example "404 Not Found"

    `/instructors/nonexistent` returns

    ``` JSON
    {
        "timestamp": "Thu, 31 Dec 2020 00:00:00 GMT",
        "status": 404,
        "error": "Bad Request: Invalid parameter", 
        "message": "Instructor not found",
    }
    ```

## Grade Distribution

### /grades/raw
**GET a list of grade distribution results via a query/**

#### Parameters

!!! info
    Endpoint that utilize query params must follow by this format:
    `?key1=value1&key2=value2`

    `?` is use to start the query params string with &  to separate each param


!!! warning
    One problem with department such as I&C SCI and CRM/LAW, since the `&` and  `/` are reserved for URLs, you must use their URL encode representation.
    `I&C SCI` -> `I%26C SCI`
    `CRM/LAW` -> `CRM%2FLAW`


| Parameter | Description | Example |
|-----------|-------------|---------|
| `year` | School year, must be <START_YEAR>-<END_YEAR> | 2019-20 |
| `quarter` | Quarter, options are Fall, Winter, Spring |  |
| `instructor` | Instructor, must following the format (last name, first initial.) |  PATTIS, R. |
| `department` | Department short-hand | I&C SCI |
| `number` | Course number | 32A |
|  `code` | 5-digit course code on WebSoC | 35540 |


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
<!-- | `404` | Result not found | -->

??? example "200 Successful Response"
    To lookup grade distribution for I&C SCI 33 during the school year 2018-19 and 2019-20 taught by professor Pattis:

    `/grades/raw?year=2018-19;2019-20&instructor=PATTIS, R.&department=I%26C SCI&quarter=Fall&number=33` returns

    ``` JSON
    [
        {
            "year": "2018-19",
            "quarter": "FALL",
            "department": "I&C SCI",
            "number": "33",
            "code": 36620,
            "section": "A",
            "instructor": "PATTIS, R.",
            "type": "LEC",
            "gradeACount": 125,
            "gradeBCount": 72,
            "gradeCCount": 31,
            "gradeDCount": 16,
            "gradeFCount": 33,
            "gradePCount": 1,
            "gradeNPCount": 0,
            "gradeWCount": 1,
            "averageGPA": 2.84
        },
        {
            "year": "2019-20",
            "quarter": "FALL",
            "department": "I&C SCI",
            "number": "33",
            "code": 35500,
            "section": "A",
            "instructor": "PATTIS, R.",
            "type": "LEC",
            "gradeACount": 132,
            "gradeBCount": 83,
            "gradeCCount": 41,
            "gradeDCount": 18,
            "gradeFCount": 36,
            "gradePCount": 0,
            "gradeNPCount": 3,
            "gradeWCount": 1,
            "averageGPA": 2.8
        }
    ]
    ```

??? example "400 Bad Request"
    
    `/grades/raw?year=2018&instructor=PATTIS, R.&department=I%26C SCI&quarter=Fall&number=33` returns

    ``` JSON
    {
        "timestamp": "Thu, 31 Dec 2020 00:00:00 GMT",
        "status": 400,
        "error": "Bad Request: Invalid syntax in parameters", 
        "message": "Invalid syntax found in parameters. Exception occured at '2018' in the [year] query value",
    }
    
    ```

### /grades/calculated
**GET a list of grade distribution results via a query/**

#### Parameters
Please follow the above documentation on the `/grades/raw` endpoint, for information about the parameters.

#### Response

| Code | Description |
|------|-------------|
| `200` | A JSON object containing statistics of the grade distribution on all the courses found, and a list of the courses found. |
| `400` | Invalid parameter syntax. |
<!-- | `404` | Result not found | -->

??? example "200 Successful Response"
    To lookup grade distribution for I&C SCI 33 during the school year 2018-19 and 2019-20 taught by professor Pattis:

    `/grades/calculated?year=2018-19;2019-20&instructor=PATTIS, R.&department=I%26C SCI&quarter=Fall&number=33` returns

    ``` JSON
    {
        "gradeDistribution": {
            "SUM(gradeACount)": 257,
            "SUM(gradeBCount)": 155,
            "SUM(gradeCCount)": 72,
            "SUM(gradeDCount)": 34,
            "SUM(gradeFCount)": 69,
            "SUM(gradePCount)": 1,
            "SUM(gradeNPCount)": 3,
            "SUM(gradeWCount)": 2,
            "AVG(averageGPA)": 2.82,
            "COUNT()": 2
        },
        "courseList": [
            {
                "year": "2018-19",
                "quarter": "FALL",
                "department": "I&C SCI",
                "number": "33",
                "code": 36620,
                "section": "A",
                "instructor": "PATTIS, R.",
                "type": "LEC"
            },
            {
                "year": "2019-20",
                "quarter": "FALL",
                "department": "I&C SCI",
                "number": "33",
                "code": 35500,
                "section": "A",
                "instructor": "PATTIS, R.",
                "type": "LEC"
            }
        ]
    }
    ```

??? example "400 Bad Request"
    
    `/grades/calculated?year=2018&instructor=PATTIS, R.&department=I%26C SCI&quarter=Fall&number=33` returns

    ``` JSON
    {
        "timestamp": "Thu, 31 Dec 2020 00:00:00 GMT",
        "status": 400,
        "error": "Bad Request: Invalid syntax in parameters", 
        "message": "Invalid syntax found in parameters. Exception occured at '2018' in the [year] query value",
    }
    
    ```

## Schedule

To get schedule of classes data, please use this npm package https://github.com/icssc-projects/websoc-api made by one of our team members. This API allows access to school, department, course, and section data in a hierarchical JSON format. This module cannot be used on a browser as it uses a library called Camaro that uses features only available in NodeJS.

We are planning to integrate this package onto the API, but it's scheduled for future release!
