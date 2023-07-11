const swaggerUI = require("swagger-ui-express");
const yamal = require("yamljs");
const swaggerJSDocs = yamal.load("Swagger.yaml");

const options = {
    customCss: `img {content:url(\'../logo.svg\'); height:auto;}`,
    customfavIcon: "../favicon.ico",
    customSiteTitle: "Code Improve API Doc"
};

module.exports = { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(swaggerJSDocs) };
//module.exports = { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(swaggerJSDocs, options) };