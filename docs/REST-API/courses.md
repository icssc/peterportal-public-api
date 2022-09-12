**📚 Find information on UC Irvine courses here**

Try out one of these quick ways to play with our courses endpoints:

=== "curl"

    <div class="termy">

    ```console
    $ curl https://api.peterportal.org/rest/v0/courses/all

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

    </div>

=== "python"

    <div class="termy">

    ```console
    $ python -m pip install requests
    ---> 100%
    $ python
    Python 3.8.5
    # >>>$ import requests
    # >>>$ response = requests.get("https://api.peterportal.org/rest/v0/courses/all")
    # >>>$ response.json()

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

    </div>

### `/courses/all`

**GET all courses**

| Code  | Description                                                                                                                                                            |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200` | A list of all courses available on the UCI Catalogue. Each element is a JSON object containing information on each course (department, number, title, and description) |

??? success "200 Successful Response"

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

| Parameter  | Description                                        | Example                         |
| ---------- | -------------------------------------------------- | ------------------------------- |
| `courseID` | Course department + course number (without spaces) | I&CSCI53, COMPSCI122B, BIOSCI43 |

#### Responses

| Code  | Description                                                                |
| ----- | -------------------------------------------------------------------------- |
| `200` | A JSON object containing every information available on a specific course. |
| `404` | Invaild ID/Course not found                                                |

??? success "200 Successful Response"

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
        "prerequisite_for": [
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

??? fail "404 Not Found"

    `/courses/I&CSCI5555` returns

    ``` JSON
    {
        "timestamp": "Thu, 31 Dec 2020 00:00:00 GMT",
        "status": 404,
        "error": "Bad Request: Invalid parameter",
        "message": "Course not found",
    }
    ```
