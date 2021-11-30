# swaggah
Zero-configuration Swagger/SwaggerUI (openapi spec) for NodeJs  
Build upon `swagger-ui-express`

## Description  
The problem with most Swagger packages for node is that you have to write the entire  
`swagger.json` file yourself. Or in some cases you have to add code to your api code  
to get the library to recognize what is happening.  

This makes it rather painful to add swagger to existing api's and also makes it more  
probable that the api explorer is out of date when you visit it.  

The reason for this is the inherent limitations in node of loose typing, so there is  
really no way to retrieve all the information needed to build the full `swagger.json`  
file without some user input.

My solution to this is to scrape the express router stack to get all the registered   
endpoints and build the `swagger.json` file from that. You do this as you run the  
project locally, the file is then saved, and available for edit so that you can fill in  
response examples and query parameters and other things that we're unable to scrape  
from the router stack.  

## Usage  
Add the following code to your app. You should call `.register` after all endpoints  
are registered in your app (`app` is your instance of `express`) 
```javascript
  let swaggah = require('swaggah');
  swaggah.register(app)
``` 
When you run your project you will now get a new file generated in your project root  
called `swagger.json`. This will have scraped all endpoints from the router stack  
and built as good a file as it can.

You can then edit the `swagger.json` file yourself, adding in types, query parameters  
response examples etc. New endpoints will be added when you run the projects  
but changes you do to existing ones are preserved.

Swaggah can recognize:
* Endpoints and enpoint types (get, put, post, delete) are recognized
* Url parameters are recognized (types are not, assumed to be strings)

## Endpoints registered by swaggah
* `swagger.json` is available at `/swagger/v1/swagger.json`
* Swagger-UI is available at `/swagger`
