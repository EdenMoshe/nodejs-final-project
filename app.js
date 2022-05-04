require("./middlewares/connectToDb");
const express = require("express");
const app = express();
const usersRouter = require("./Routes/Users/userRouter");
const cardsRouter = require("./Routes/Cards/cardsRouter");
const infoRoute = require("./Routes/infoRoute");
const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");

app.use(morgan(chalk.cyan(":method :url :status :response-time ms")));
app.use(cors());

app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/info", infoRoute);

const PORT = 8181;
app.listen(PORT, () =>
  console.log(chalk.blueBright.bold(`server run on: http://:localhost:${PORT}`))
);
