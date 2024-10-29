# url-shortening--service-project# URL Shortening Service

This project is a fully-featured URL shortening service inspired by Bitly. It is built with Node.js, Express, TypeScript and SQLite and includes various advanced functionalities, such as custom aliases, URL expiration, rate limiting, and URL access statistics.

## Project Overview

The URL Shortening Service provides a reliable way to generate short links for long URLs and allows users to customize their shortened URLs with optional expiration dates, rate limits, and analytics on usage. It is designed with high code quality, robust API design, and efficient data management to handle different user cases effectively.

## Features

1. **URL Shortening**: Easily generate short URLs for long links.
2. **URL Redirection**: Redirect the shortend long URLs.
3. **Custom Aliases**: Users can provide a custom alias for their shortened URLs.
4. **URL Expiration**: URLs can be set to expire after a specific date and time.
5. **Rate Limiting**: Limits the number of URL shortening requests per minute to prevent abuse.
6. **Access Statistics**: Track how many times each shortened URL has been accessed.

## Code Quality and Structure

- **Modular Code**: The project codebase is structured in a modular format, with separate files for the main server configuration (`index.ts`), route definitions (`urlRoutes.js`), and controller logic (`urlController.js`).
- **Controller Design**: The main application logic is encapsulated in the `urlController.js` file, where each function (shortening, redirection, statistics) is clearly defined, enhancing readability and maintainability.
- **Error Handling**: Comprehensive error handling is implemented to catch and handle errors gracefully, with proper HTTP status codes (e.g., `400` for bad requests, `404` for not found, `410` for expired URLs).
- **Environment Configuration**: Sensitive information is managed through environment variables stored in a `.env` file.

## API Design and Implementation

- **RESTful API**: The API follows RESTful principles with clean and meaningful endpoints.
- **Endpoints**:
  - **POST** `/api/shorten`: Creates a new shortened URL with optional parameters for custom alias and expiration.
  - **GET** `/:shortId`: Redirects to the original URL if it exists and hasn’t expired.
  - **GET** `/api/stats/:shortId`: Provides usage statistics for a given shortened URL.
- **Status Codes**: The API uses standard HTTP status codes for various scenarios:
  - `201` for successful creation
  - `302` for redirection
  - `400` for client errors (e.g., invalid URL, duplicate custom alias)
  - `410` for expired URLs
  - `429` for rate limit exceeded
- **Input Validation**: The service validates inputs for URL format, checks for duplicate custom aliases, and validates expiration dates, ensuring reliability and predictability in responses.

## Data Storage and Management

- **Database**: SQLite is used as the database for this project, chosen for its simplicity and ease of use in a lightweight service.
- **Data Schema**: The `urls` table stores information about each shortened URL with the following columns:
  - `id` (Primary Key): Unique identifier for each entry
  - `originalUrl`: The original long URL provided by the user
  - `shortUrl`: The generated short URL or custom alias
  - `shortId`: Unique short identifier, either randomly generated or custom
  - `accessCount`: Tracks the number of times the short URL is accessed
  - `expiresAt`: Date and time when the short URL expires (optional)
- **Data Handling**:
  - **URL Shortening**: Short URLs are created using the `nanoid` package, which generates a random short identifier. If a custom alias is provided, the service checks its availability before assignment.
  - **Storage**: All URL data is stored persistently in the SQLite database, ensuring consistent data access and reliability.

## Handling Edge Cases

The service is designed to handle a variety of edge cases for a robust user experience:

1. **Invalid URLs**: The service checks for valid URL format using regex. Invalid URLs return a `400` error with a descriptive message.
2. **Duplicate Short URLs**: When a custom alias is provided, the service checks for existing entries with the same alias. If found, it returns a `400` error indicating the alias is taken.
3. **Expired URLs**: If a URL has an expiration date and is accessed after it has expired, the service returns a `410 Gone` status, indicating the URL is no longer active.
4. **Nonexistent Short URLs**: When attempting to access or fetch statistics for a nonexistent `shortId`, the service returns a `404 Not Found` error.
5. **Rate Limiting Exceeded**: To prevent abuse, the `/api/shorten` endpoint is rate-limited. If users exceed the rate limit, they receive a `429 Too Many Requests` response.

## Optional Features Implementation

### 1. URL Expiration
- **Configuration**: Users can specify an expiration date (`expiresAt`) for a shortened URL.
- **Functionality**: After the expiration date, the URL returns a `410 Gone` status, indicating it is no longer available.
- **Use Case**: Useful for temporary links or time-sensitive information.

### 2. Custom Aliases
- **Configuration**: Users can provide a custom alias (`customAlias`) instead of a randomly generated ID.
- **Functionality**: The service checks if the alias is already in use and returns a `400` error if it is. Otherwise, it assigns the alias to the shortened URL.
- **Use Case**: Allows users to create memorable or brand-specific short URLs.

### 3. Access Statistics
- **Configuration**: Each access to a shortened URL is tracked.
- **Functionality**: Users can view statistics for each URL, including the `accessCount`, `originalUrl`, and `expiresAt`.
- **Use Case**: Provides insights into how many times a URL has been visited.

### 4. Rate Limiting
- **Configuration**: The `express-rate-limit` package limits requests to the `/api/shorten` endpoint.
- **Functionality**: Limits each IP address to 5 requests per minute, returning a `429` status if the limit is exceeded.
- **Use Case**: Prevents abuse and excessive usage of the URL shortening service.

## Setup Instructions

### Prerequisites
- **Node.js** (v14 or later)
- **SQLite3** (installed locally)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/url-shortening-service.git
   cd url-shortening-service

2. **Install Dependencies**:

  ```bash
   npm install

3. **Set Up Environment Variables**:

Create a .env file in the root directory and configure the following variables:
   PORT=3000
   DB_PATH=./database.sqlite

4. **Initialize the Database**:

  Run this command to create the required SQLite database and table structure:
 ```bash
   npx sqlite3 database.sqlite < schema.sql

5. **Start the Server**:

```bash
   npm run dev

The application will be available at http://localhost:3000
