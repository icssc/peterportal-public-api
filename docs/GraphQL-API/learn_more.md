# Learn More

## What is GraphQL?

GraphQL is a query language for APIs. It provides the user exactly what they need and nothing more. What's so special about GraphQL? Here are some of its defining features: 

* Ask for exactly what you need, and you will get exactly that. Anything GraphQL returns is completely predictable.
* Get multiple resources in only one request. Unlike REST, a single request can return multiple resources.
* Know exactly what's possible. With types and fields, you can always know what went wrong in a request.

## How do I use GraphQL?

To make a request to our graphql endpoint, you simply make a POST request, passing the query string in the body of the request. 

=== "curl"

    <div class="termy">

    ```console
    $ curl 'https://api.peterportal.org/graphql' \
     -H 'Content-Type: application/json' \
     -d '{"query":"query {  course(id:\"COMPSCI161\") {    id    title    department  }}"}'

    {
        "data": {
            "course": {
                "id": "COMPSCI161",
                "title": "Design and Analysis of Algorithms",
                "department": "COMPSCI"
            }
        }
    }
    ```
    
    </div>

=== "python"

    <div class="termy">

    ```console
    $ python -m pip install requests
    ---> 100%
    $ python 
    Python 3.8.5 
    # >>>$ import requests, json
    # >>>$ body = {'query': 'query { course(id:"COMPSCI161") { id title department }}'}
    # >>>$ headers ={"Content-Type": "application/json"}
    # >>>$ response = requests.post("https://api.peterportal.org/graphql", data=json.dumps(body), headers=headers)
    # >>>$ response.json()

    {
        "data": {
            "course": {
                "id": "COMPSCI161",
                "title": "Design and Analysis of Algorithms",
                "department": "COMPSCI"
            }
        }
    }
    ```

    </div>

If you want to learn about how GraphQL works, you can check out their website that goes over the language. <https://graphql.org/learn/>

Here, we will talk more about how to use GraphQL for the PeterPortal API. I recommend opening our [GraphQL playground](/graphql-playground) to test queries and get familiar. Please note that all of this information and much more is found in the `DOCS` tab in the playground.

## Tutorial

### Queries

Our API has 6 queries you can use to make a request for data. 

* `course`
* `instructor`
* `allCourses`
* `allInstructors`
* `schedule`
* `grades`

Each query returns an object of a certain type. For example, a `course` query will return a `Course` type, and an `allCourses` query will return a list of `Course` types. 

Based on the type, different fields can be specified. A `Course` type would have a field like `title` or `department`. By specifying which fields, the client will only receive those fields in the response. To find more about what fields each type has, check out the documentation in the playground. 

Some queries require arguments that will like our REST endpoints have parameters. This will help specify which course or instructor you want in a query. 

??? example "Example Query 1"
    
    In this example, the `course` query returns the `ID`, `title`, and `department` of the course `COMPSCI 161`, based on the argument passed.

    ``` graphql
    query {
      course(id:"COMPSCI161") {
        id
        title
        department
      }
    }
    ```
    
??? example "Example Query 2"
    Here is another example which returns sum of students who received As, Bs, Cs, Ds, Fs, and the average GPA of instructor "PATTIS, R." excluding P/NP.

    ``` graphql
    query {
      grades(excludePNP: true, instructor: "PATTIS, R.")
      {
        aggregate{
          sum_grade_a_count
          sum_grade_b_count
          sum_grade_c_count
          sum_grade_d_count
          sum_grade_f_count
          average_gpa
        }
      }
    }
    ```

### Nested Objects

One of the main features of GraphQL is being able to nest objects and fields inside a query. This will let the client get multiple resources in only one request. 

For example, a `Course` type will have a list of `CourseOffering` types, which are instances of the course in UCI's schedule of classes. `CourseOffering` types can also have nested types, like `Meeting`, which hold information about when a class meets. 

Almost all objects are linked to other objects in different ways. A `Course` will have multiple `Instructors` in its `instructor_history`, and an `Instructor` will have multiple `Courses` in its `course_history`.

??? example "Example"
    
    In this example, the `course` query requests a list of `Instructors` that taught the course, and all the `Courses` that these instructors taught as well.

    ``` graphql
    query { 
        course(id:"COMPSCI161") {
            instructor_history {
                name
                email
                course_history {
                    id
                    title
                }
            }
        }
    }
    ```

These are the basics of using GraphQL for the PeterPortal API. However, GraphQL really has so much more to offer, and if you're looking to learn more about this new technology, we highly recommend checking out their website, <https://graphql.org/>. There are links to so many more tutorials, examples and more.

## How we added GraphQL
To build our GraphQL endpoint, we used [GraphQL.js](https://graphql.org/graphql-js/), a node module you can use to create your own GraphQL API.