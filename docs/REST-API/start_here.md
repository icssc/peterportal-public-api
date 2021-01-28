# Start here

## What is a RESTful API?

An API is an Application Programming Interface. It's how programs talk to each other. PeterPortal Public API is a Web API, meaning anyone and any app can talk to it over the web! You can use Peterportal Public API to get data for apps that help students.

To call a Web API RESTful, or REST, means that it meets a set of communication standards.

First of all, REST is an an acronym: **RE**presentational **S**tate **T**ransfer. But that doesn't really help understanding it :'( 

There's a lot that REST APIs are used for, but I'll explain it more in the scope of what you can do with PeterPortal API.  

* A REST API is Stateless. This means that it does not rely on nor take into account previous messages that you sent to it. That means for each request you send to it, you need to send all the information that the REST API needs to understand your request.  
* Our REST API returns and accepts [JSON](https://www.w3schools.com/whatis/whatis_json.asp). REST APIs are not restricted to JSON; however, that is the standard you will see for almost every public Web API. [JSON syntax is kinda like a Python dictionary](https://www.w3schools.com/whatis/whatis_json.asp). 



## Quickstart

Try out our REST API using any of the following methods:


=== "curl"

    <div class="termy">

    ```console
    $ curl https://api.peterportal.org/rest/v0/courses/all --header "x-api-key: YOUR_API_KEY_HERE"

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
    # >>>$ headers = { "x-api-key": "YOUR_API_KEY_HERE"}
    # >>>$ response = requests.get("https://api.peterportal.org/rest/v0/courses/all", headers=headers)
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

