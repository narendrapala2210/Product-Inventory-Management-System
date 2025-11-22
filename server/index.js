require("dotenv").config(); // loand env variables
const initDb = require("./database");

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

initDb().then(() => {
  console.log("SQLite DB initialized with tables");
});
