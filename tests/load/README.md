# Load Testing with Gatling

This document provides an overview of load testing using Gatling and instructions on how to run the tests.

## Introduction to Gatling

Gatling is a powerful open-source load testing tool designed for web applications. It allows you to simulate a large number of users interacting with your application to measure its performance and identify bottlenecks.

## Prerequisites

Before running the tests, ensure the following are installed on your system:

- Java (JDK 8 or higher)
- [Gatling standalone](https://docs.gatling.io/reference/install/oss/#use-the-standalone-bundle).
- MongoDB Compass / MongoSH installed.

## Project Structure

The load testing scripts are located in the `/src` directory.

## Running the Tests

Follow these steps to execute the load tests:

1. **Navigate to the Gatling Installation Directory**  
   Open a terminal and navigate to the Gatling installation directory.

2. **Load test**
   To load the tests substitute the installation `/src` by the one in this repository under `/src`.

3. **IMPORTANT! Reset DB**
   Before starting the tests the database must be cleared using MongoDB Compass or MongoSH.

4. **Run the Simulation**  
   Use the following command to execute the simulation (Windows):

   ```pwsh
   .\mvnw gatling:test
   ```

5. **View the Results**  
   After the test completes, Gatling generates an HTML report, which you can open in a browser to analyze the performance metrics.

## Additional Resources

- [Gatling Official Documentation](https://gatling.io/docs/)
- [Gatling GitHub Repository](https://github.com/gatling/gatling)
