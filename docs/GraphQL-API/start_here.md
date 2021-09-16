# Start here

[GraphQL](https://graphql.org/) is not an application; rather, it is a Query Language for Web APIs.


## Try it out

You can try out our documentation live at our [GraphQL Playground](/graphql-playground).

![playground demo](https://gifs.tisuela.com/web-dev/graphql_playground_demo.gif)

Not only can you try it out, but our Playground also has the most up-to-date docs -- we highly recommend you check it out if you're interested in learning GraphQL or using our endpoint.


!!! example "Example Query 1"
    Here is an example which returns the ID, name, and department of every course in our database.
    You can paste this into our [GraphQL Playground](/graphql-playground), or write this in the `body` of a `POST` request.

    ``` graphql
    query {
      allCourses {
        id
        name
        department
      }
    }
    ```

!!! example "Example Query 2"
    Here is another example which returns sum of students who received As, Bs, Cs, Ds, Fs, and the average GPA of instructor "PATTIS, R." excluding P/NP.
    You can paste this into our [GraphQL Playground](/graphql-playground), or write this in the `body` of a `POST` request.

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
        instructors
      }
    }
    ```
## Documentation

📃 Checkout our documentation at [api.peterportal.org/graphql-docs/](/graphql-docs/).
