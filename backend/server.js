const express = require("express");
const cors = require("cors");
const contestsRouter = require("./routes/contests");

const app = express();

app.use(cors());
app.use("/contests", contestsRouter);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
