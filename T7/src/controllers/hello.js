const { HelloWorldService } = require("../services/hello");

async function helloWorldController(_req, res) {
    // _req means we're not using this parameter
    return res.send(HelloWorldService.sayHello());
}

module.exports = { helloWorldController };
