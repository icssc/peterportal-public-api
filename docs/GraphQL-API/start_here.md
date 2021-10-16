# Start here

[GraphQL](https://graphql.org/) is not an application; rather, it is a Query Language for Web APIs.


## Try it out

You can try out our documentation live at our [GraphQL Playground](/graphql-playground).

![playground demo](https://gifs.tisuela.com/web-dev/graphql_playground_demo.gif)

Not only can you try it out, but our Playground also has the most up-to-date docs -- we highly recommend you check it out if you're interested in learning GraphQL or using our endpoint.


!!! example "Example Query"
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

## Documentation

📃 Checkout our documentation at [api.peterportal.org/graphql-docs/](/graphql-docs/).
