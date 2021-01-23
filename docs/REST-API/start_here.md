# Start here

## What is a RESTful API?

An API is an Application Programming Interface. It's how programs talk to each other. You can use Peterportal Public API to get data for apps that help students!



## Quickstart

Try out our API using any of the following methods:

=== "curl"

    <div class="termy">

    ```console
    $ curl https://api.peterportal.org/courses/all

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
    # >>>$ response = requests.get("https://api.peterportal.org/courses/all")
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


Full documentation can be found [here](https://api.peterportal.org/docs/REST-API/endpoints/)

