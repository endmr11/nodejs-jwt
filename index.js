const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbconfig = require("./config/db_config");
const auth = require("./middlewares/auth.js");
const errors = require("./middlewares/errors.js");
const unless = require("express-unless");


const port = 3000;

mongoose.Promise = global.Promise;
mongoose
  .connect(dbconfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("MongoDB bağlantısı başarılı.");
    },
    (err) => {
      console.error("MongoDB bağlantısı başarısız! " + err);
    }
  );

auth.authenticateToken.unless = unless;
app.use(
  auth.authenticateToken.unless({
    path: [
      { url: "/users/login", methods: ["POST"] },
      { url: "/users/register", methods: ["POST"] },
      { url: "/users/otpLogin", methods: ["POST"] },
      { url: "/users/verifyOTP", methods: ["POST"] },
    ],
  })
);

app.use(express.json());
app.use("/users", require("./routes/users_routes.js"));
app.use(errors.errorHandler);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Dinlenen Port: ${port}!`));
