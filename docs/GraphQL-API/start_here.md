# Start here

[GraphQL](https://graphql.org/) is not an application; rather, it is a Query Language for Web APIs.


## Try it out

To make a request simply send a POST request to our graphql endpoint, <https://api.peterportal.org/graphql/>

You can try out our API live at our [GraphQL Playground](/graphql-playground).

![playground demo](https://gifs.tisuela.com/web-dev/graphql_playground_demo.gif)

Not only can you try it out, but our Playground also has the most up-to-date docs -- we highly recommend you check it out if you're interested in learning GraphQL or using our endpoint.


!!! example "Example Query"
    Here is an example which returns the ID, title, and department of every course in our database.
    You can paste this into our [GraphQL Playground](/graphql-playground), or write this in the `body` of a `POST` request.

    ``` graphql
    query {
      allCourses {
        id
        title
        department
      }
    }
    ```


## Documentation

📃 Documentation can be found inside our [GraphQL Playground](/graphql-playground), by clicking the `DOCS` tab on the right-hand side.

If you're new to GraphQL, you can learn more about how to use it in our API [here](/docs/GraphQL-API/learn_more).
