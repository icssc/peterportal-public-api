# Getting Started

## What is an API?
An API is an **Application Programming Interface**. It's how programs talk to each other. PeterPortal Public API is a Web API, meaning anyone and any app can talk to it over the web! You can use Peterportal Public API to get data for apps that help students.

PeterPortal API offers a [RESTful API](/docs/REST-API/start_here) as well as a [GraphQL API](/docs/GraphQL-API/start_here), and both will return JSON-encoded responses, with standard HTTP response codes and verbs. 

## What is REST and GraphQL?

REST and GraphQL are two different methods of data retrieval. While REST is the more standard and traditional approach, GraphQL is the new revolutionary approach for querying APIs. 

!!! rest-api "REST"
    REST stands for **representational state transfer** but what does this even mean? A REST API has endpoints that represent resources, or data. By making a request to these endpoints, the server will respond with a representation of the state of the resource. 

    You can make requests using the standard HTTP methods (GET, POST, PUT, DELETE, and PATCH), but with our REST API you will primarily use GET requests.

!!! graphql "GraphQL"
    GraphQL is a query language for APIs. In GraphQL, our data is represented as a Graph, with nodes as different data items and edges connecting their relationships. What's different about GraphQL is that users can request multiple resources in a single request and can also specify what data they want from the API. 


### Which one should I use?
To decide which one to use will almost always depend on your use case. While REST is much simpler to use, you might not want to pass up on the rich features of using GraphQL. 

To help you make a decision you can learn more about each of the APIs, in their respective documentation. You can check their documentation our here: 

* [REST API](/docs/REST-API/start_here)  
* [GraphQL API](/docs/GraphQL-API/start_here)



## How do I get started?
Just go for it. Unlike many other APIs, we do NOT require any API keys, or authentication to utilize our API. We wanted to make this API open to everyone with no barriers to start using our API. 

