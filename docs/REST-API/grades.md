**🅰 Find information on UCI grades here.**


Try out one of these quick ways to play with our grades endpoints:

=== "curl"

    <div class="termy">

    ```console
    $ curl https://api.peterportal.org/rest/v0/grades/raw --header "x-api-key: YOUR_API_KEY_HERE"

    [
      ...
      {
            "year": "2018-19",
            "quarter": "FALL",
            "department": "I&C SCI",
            "number": "33",
            "code": 36620,
            "section": "A",
            "instructor": "PATTIS R.",
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
      ...
    ]
    ```
    
    </div>

=== "python"

    <div class="termy">

    ```console
    $ python -m pip install requests
    ---> 100%
    $ python 
    Python 3.8.5 
    # >>>$ import requests
    # >>>$ headers = { "x-api-key": "YOUR_API_KEY_HERE"}
    # >>>$ response = requests.get("https://api.peterportal.org/rest/v0/grades/raw", headers=headers)
    # >>>$ response.json()

    [
    ...
    [
      ...
      {
            "year": "2018-19",
            "quarter": "FALL",
            "department": "I&C SCI",
            "number": "33",
            "code": 36620,
            "section": "A",
            "instructor": "PATTIS R.",
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
      ...
    ]
    ```

    </div>


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
| `year` | School year, must be <START_YEAR\>-<END_YEAR\> | 2019-20 |
| `quarter` | Quarter, options are Fall, Winter, Spring |  |
| `instructor` | Instructor, must following the format (last_name first_initial.) |  PATTIS R. |
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

??? success "200 Successful Response"
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
            "instructor": "PATTIS R.",
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
            "instructor": "PATTIS R.",
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

??? fail "400 Bad Request"
    
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

??? success "200 Successful Response"
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
                "instructor": "PATTIS R.",
                "type": "LEC"
            },
            {
                "year": "2019-20",
                "quarter": "FALL",
                "department": "I&C SCI",
                "number": "33",
                "code": 35500,
                "section": "A",
                "instructor": "PATTIS R.",
                "type": "LEC"
            }
        ]
    }
    ```

??? fail "400 Bad Request"
    
    `/grades/calculated?year=2018&instructor=PATTIS, R.&department=I%26C SCI&quarter=Fall&number=33` returns

    ``` JSON
    {
        "timestamp": "Thu, 31 Dec 2020 00:00:00 GMT",
        "status": 400,
        "error": "Bad Request: Invalid syntax in parameters", 
        "message": "Invalid syntax found in parameters. Exception occured at '2018' in the [year] query value",
    }
    
    ```


