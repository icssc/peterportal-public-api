#Using an API Key

## How to use your API key
To use your api key, add it to the headers of your request, with `x-api-key` as the key and your api key as the value.
```
x-api-key: YOUR_API_KEY_HERE
```




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

    



Failing to provide valid credentials will respond with a JSON error object.

!!! fail "401 Unauthorized"
    ```
    {
        "timestamp": "Fri, 01 Jan 2021 00:00:00 GMT",
        "status": 401,
        "error": "Invalid Credentials.",
        "message": "The credentials found were invalid. Please ensure a valid api key is in the request. See documentation for more info."
    }
    ```

## Securing your API key

It is important that you keep your api key a secret and do NOT share it with others. Ensure you do not include your api key when committing to a public repository such as GitHub. For some helpful tips
on how to keep your api key safe, please click [here](https://medium.com/chingu/an-introduction-to-environment-variables-and-how-to-use-them-f602f66d15fa).