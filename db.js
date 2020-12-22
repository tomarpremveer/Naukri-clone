const mongodb = require("mongodb");
const CONNECTIONSTRING =
  "mongodb://localhost:27017/naukri?retryWrites=true&w=majority";
const PORT = 3000;
mongodb.connect(
  CONNECTIONSTRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    module.exports = client;
    if (err) {
      console.log(err);
    }
    const app = require("./app");
    app.listen(PORT);
  }
);
