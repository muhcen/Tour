const dotenv = require("dotenv").config({ path: "./config.env" });

const app = require("./app");

const port = 8000;

app.listen(port, () => {
  console.log(`server is running on port(${port})`);
});
