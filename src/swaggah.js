const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json')
let swaggerDocument = ''

module.exports = {
  register: function (app) {

    let addRoute = function(obj, path, type){
      // Replacing (:) params in url with ({}) for swagger
      path = path.replace(/:/g, '{') // Adapt to swagger compatible param declaration
      let tmpList = path.split('/')
      let newPath = ''
      let paramList = []
      tmpList.forEach((elem, index, array) =>{
        if(elem === '') return
        if(elem.includes('{')){
          newPath = `${newPath}/${elem}}`
          paramList.push(elem.replace('{', ''))
        } else{
          newPath = `${newPath}/${elem}`
        }
      })
      path = newPath // Just added closing brackets to elements

      if(!obj.paths[path]) obj.paths[path] = {}
      if(!obj.paths[path][type]) {
        obj.paths[path][type] = {
          "summary": `${type.toUpperCase()} ${path}`,
          "produces": [
            "application/json"
          ],
          "parameters": [],
          "responses": {
            "200": {
              "description": "200 response",
              "examples": {
                "application/json": {
                }
              }
            }
          }
        }

        // Adding url params
        obj.paths[path][type].parameters = []
        paramList.forEach(p => {
          obj.paths[path][type].parameters.push(
          {
            "in": "path",
            "name": `${p}`,
            "description": `Parameter ${p}`,
            "required": true,
            "type": "string",
            "format": "string"
          })
        })

      }

    }

    let init = function(){
      let swaggerFilePath =  path.join(__dirname, 'swagger.json')

      let swaggerObj;
      try{
        swaggerObj = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'))
      } catch (e) {
        console.log('Failed reading an existing swagger.json file, creating one from scratch')
        swaggerObj = {
          "swagger": "2.0",
          "info": {
            "title": packageJson.name,
            "version": packageJson.version
          },
          "consumes": [
            "application/json"
          ],
          "produces": [
            "application/json"
          ],
          "paths": {
          }
        }
      }

      let route
      let routes = [];
      app._router.stack.forEach(function(middleware){
        if(middleware.route){ // routes registered directly on the app
          routes.push(middleware.route);
        } else if(middleware.name === 'router'){ // router middleware
          middleware.handle.stack.forEach(function(handler){
            route = handler.route;
            route && routes.push(route);
          });
        }
      });
      routes.forEach(route => {
        let type
        if(route.methods.get) type = 'get'
        if(route.methods.put) type = 'put'
        if(route.methods.post) type = 'post'
        if(route.methods.delete) type = 'delete'
        addRoute(swaggerObj, route.path, type)
      })

      swaggerDocument = JSON.stringify(swaggerObj, null, 2)
      fs.writeFileSync(swaggerFilePath, swaggerDocument)
    }
    init()


    app.get('/swagger/v1/swagger.json', (req, res) => res.json(swaggerDocument));
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerDocument)));

  }
}
