# Capstone
- - -
Camosun College - Computer Systems Technology
A Capstone 2015 Project

Ministry of Enviroment, BC Parks
In collaboration with Sierra Systems Group Inc.

## Long Term Ecological Monitoring Application Cloud

LTEMAC is a server software package designed to give the LTEMA
application the ability to store site surveys in the cloud.

### Key Features
* Stores surveys as JSON strings
* Authenticates user access with secret keys

### API Functions
* /image_auth : Get credentials for accessing Flickr image account
* /getSurveys : Get a list of known surveys
* /download : Pull a survey from the server
* /upload : Push a survey to the server

### Dependencies
* express
* pg
* body-parser
* connect-timeout

### QA Tools
* Grunt (Javascript Task Runner)
* JSHint (Static Code Analysis Tool)
* JSCS (JavaScript Code Style checker)
* Mocha (JavaScript Test Framework)

##### Run using the following commands to set up the local enviroment for testing

```
npm install -g jshint
npm install -g jscs
npm install -g mocha
npm install -g grunt-cli
```
These commands must be run in the root of the project (not in the app directory).
```
npm install grunt-contrib-jshint --save-dev
npm install grunt-cafe-mocha --save-dev
npm install grunt-jscs --save-dev
```
    
### Project Team:
* Robert Williams
* Nathan Staples
* Neil McMunn
