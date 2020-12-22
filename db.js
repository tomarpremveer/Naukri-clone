const mongodb = require("mongodb");
const CONNECTIONSTRIN =
  "mongodb+srv://todoapp:8268@cluster0-ygbdi.mongodb.net/naukri?retryWrites=true&w=majority";
const CONNECTIONSTRING =
  "mongodb://localhost:27017/naukri?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3000;
mongodb.connect(
  CONNECTIONSTRIN,
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
