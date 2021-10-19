**👩‍🏫 Find information on UCI instructors here.**


Try out one of these quick ways to play with our instructors endpoints:

=== "curl"

    <div class="termy">

    ```console
    $ curl https://api.peterportal.org/rest/v0/instructors/all 

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
    
    </div>

=== "python"

    <div class="termy">

    ```console
    $ python -m pip install requests
    ---> 100%
    $ python 
    Python 3.8.5 
    # >>>$ import requests
    # >>>$ response = requests.get("https://api.peterportal.org/rest/v0/instructors/all")
    # >>>$ response.json()

    [
    ...
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

    </div>



### `/instructors/all`

**GET all instructors**

#### Parameters

None. 💃

#### Responses
| Code | Description |
|------|-------------|
| `200` | A list of all instructors available on the UCI Catalogue. Each element is a JSON object containing information on each instructor (name, ucinetid, title, department). |

??? success "200 Successful Response"

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

??? success "200 Successful Response"

    `/instructors/mikes` returns

    ``` JSON
    {
        "name": "Michael Shindler",
        "ucinetid": "mikes",
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

??? fail "404 Not Found"

    `/instructors/nonexistent` returns

    ``` JSON
    {
        "timestamp": "Thu, 31 Dec 2020 00:00:00 GMT",
        "status": 404,
        "error": "Bad Request: Invalid parameter", 
        "message": "Instructor not found",
    }
    ```