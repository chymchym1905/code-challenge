# Problem 6: Software specification

## 1. Introduction & problem scope

This document outlines the specification for the Scoreboard API Service, which will handle the updating and retrieval of users' scores on the website's scoreboard. The service will ensure secure and real-time updates while preventing malicious users from altering their scores without authorization. In addition, scaling factors will be included in the app's performance requirements.

### Skateholders

The app assumes there's only one type of user

## 2. Requirements

### 2.1 Functional requirements

-   The website display the top 10 users
-   The scoreboard must update in real-time upon score change performed by the API
-   Users can perform actions to create/score
-   Each user have their authtoken when login and can only use that authtoken to create score on leaderboards
-   Horizontally scaleable using distributed systems to potentially handle enormous amount of requests

### 2.2 Non functional requirements

-   The system can watch the score changes in database level (optional)
-   The system should be designed to handle a growing numbers of user and their scores
-   The frequently accessed leaderboards should be cached using a caching mechanism

## 3. Development plan

### 3.1 Technology decision

In order to achieve the above requirements, The following technology can be taken to consideration to tackle these problems:

-   **NodeJS & ExpressJS**: a well suited backend for server development, the backbone of server-side web application.
-   **Socket.io**: a library that enables low-latency, bidirectional and event-based communication between a client and a server.
-   **Redis**: a great choice for low-latency, real-time leaderboards and small dataset. Being excel at speed but limited complex queries capabilities
-   **Redis adapter**: a server-side component which is responsible for broadcasting events to all or a subset of clients. Choice of adapater depends on choice of database

![](https://socket.io/images/broadcasting-redis-dark.png 'Source: socket.io documentation')

To ensure high avaiability and failover in distributed systems, load balancer is an indispensable component. Below are a few options:

| Scenario             | Recommended Load Balancer  |
| -------------------- | -------------------------- |
| **AWS Deployment**   | AWS ALB                    |
| **GCP Deployment**   | Google Cloud Load Balancer |
| **Azure Deployment** | Azure Load Balancer        |
| **Self-Hosted**      | NGINX                      |

While cloud provider's load balancer do supports websockets, and are easy to setup and ready to use, NGINX require highly custom configurations and sticky session.

### 3.2 Architecture

Base on the requirements, the app's architecture is divided to the following components:

-   **Middleware**: every single requests will be going through the middleware before reaching the router. Used for authentication when user access a restricted endpoint
-   **Router**: handle the the HTTP requests, define the API endpoints, handle http error and respond to the client.
-   **Services**: implement the operations performed on the database and websocket programming.

Because the dataset is small, there's no need to do data modeling in the scope of this application.

#### Below is the diagram of the app's flow for execution

![Diagram](./execution%20flow.drawio.png)

### 3.3 API endpoints documentation

#### User endpoints

| Method | Endpoint              | Description                                                                                                                                                                  |
| ------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/user/get:id`    | Get user by id                                                                                                                                                               |
| POST   | `/api/user/login`     | Return the logged-in user information if successful. <br> User must first exist in the database. <br> **Request body:** <br> `{ "userEmail*": string, "password*": string }` |
| POST   | `/api/user/register`  | Create a user in the database with an incremental id. <br> **Request body:** <br> `{ "name*": string, "email*": string, "password*": string, "rankings*": {} }`              |
| PUT    | `/api/user/update`    | Update user metadata <br> **Request body:** <br> `{ "name": string, "email": string, "password": string, "rankings": {} }`                                                   |
| DELETE | `/api/user/delete:id` | Delete user                                                                                                                                                                  |

#### Leaderboard enpoints

| Method | Leaderboard Endpoint              | Description                                                                                                                                                                                                          |
| :----: | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  GET   | `/api/leaderboard/get:id`         | Return a leaderboard <br> **Request param**: <br> - `start`: number <br> - `end`: number <br> - `dir`: "desc" or "asc" <br> **Retrieve top 10 highest score**: <br> `/api/leaderboard/get:id?start=0&end=9&dir=desc` |
|  GET   | `/api/leaderboard/get-details:id` | Return a leaderboard with user detail <br> **Request param**: <br> - `start`: number <br> - `end`: number <br> - `dir`: "desc" or "asc"                                                                              |
|  POST  | `/api/leaderboard/createscore`    | Create an entry on leaderboard <br> **Request header**:<br> - Authorization <br> **Request body**:<br> `{ "leaderboardId*": number, "score*": number }`                                                              |
|  PUT   | `/api/leaderboard/updatescore`    | Modify score on leaderboard <br> **Request header**:<br> - Authorization <br> **Request body**:<br> `{ "leaderboardId*": number, "score*": number }`                                                                 |
| DELETE | `/api/leaderboard/removescore`    | Remove a leaderboard entry <br> **Request header**:<br> - Authorization <br> **Request body**:<br> `{ "leaderboardId*": number }`                                                                                    |
