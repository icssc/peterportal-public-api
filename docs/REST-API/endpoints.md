# Endpoints

## Courses

**📚 Find information on UC Irvine courses here**

### `/courses/all`

**GET all courses**

| Code | Description |
|------|-------------|
| `200` | A list of all courses available on the UCI Catalogue. Each element is a JSON object containing information on each course (department, number, title, and description) |

??? example

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


??? example

    `/courses/I&CSCI53` returns

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
        "description": "Introduces basic principles of system software...",
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

??? example

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

#### Params:

| Parameter | Description | Example |
| `ucinetid` | Can be obtained using the /all endpoint above |  |

#### Responses

| Code | Description |
|------|-------------|
| `200` | A JSON object containing every information available on a specific instructor |
| `404` | Invaild UCInetID/Instructor not found |

??? example

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

## Grade Distribution

### /grades
**GET a list of grade distribution results via a query/**

#### Parameters

!!! info
    Endpoint that utilize query params must follow by this format:
    ?key1=value1&key2=value2`

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

All params are optional and can be multi-values by using ; as a separator.

!!! hint
    The more you narrow down your query, the faster the response! 🏃‍♀️💨 😎

#### Response

| Code | Description |
|------|-------------|
| `200` | A list of JSON object results containing the course info, count of each grades, and average GPA |
| `404` | Result not found|

??? example
    To lookup grade distribution for I&C SCI 33 during the school year 2018-19 and 2019-20 taught by professor Pattis:

    `/grades?year=2018-19;2019-20&instructor=PATTIS, R.&department=I%26C SCI&quarter=Fall&number=33` returns

    ``` JSON
    [
        {
            "year": "2018-19",
            "quarter": "Fall",
            "department": "I&C SCI",
            "number": "33",
            "code": "36620",
            "section": "A",
            "instructor": "PATTIS, R.",
            "type": "LEC",
            "a_count": 125,
            "b_count": 72,
            "c_count": 31,
            "d_count": 16,
            "f_count": 33,
            "p_count": 1,
            "np_count": 0,
            "w_count": 1,
            "average_gpa": 2.84
        },
        {
            "year": "2019-20",
            "quarter": "Fall",
            "department": "I&C SCI",
            "number": "33",
            "code": "35500",
            "section": "A",
            "instructor": "PATTIS, R.",
            "type": "LEC",
            "a_count": 132,
            "b_count": 83,
            "c_count": 41,
            "d_count": 18,
            "f_count": 36,
            "p_count": 0,
            "np_count": 3,
            "w_count": 1,
            "average_gpa": 2.8
        }
    ]
    ```

## Schedule

To get schedule of classes data, please use this npm package https://github.com/icssc-projects/websoc-api made by one of our team member. This API allows access to school, department, course, and section data in a hierarchical JSON format. This module cannot be used on a browser as it uses a library called Camaro that uses features only available in NodeJS.

We are planning to integrate this package onto the API, but it's scheduled for future release!
