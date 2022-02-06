const app = require("./app");
var port = process.env.PORT || 8080;
require = require("esm")(module/*, options*/)
module.exports = require("./app.js")

app.listen(port, function() {
    console.log("Server is running on Port: " + port);
  });
  