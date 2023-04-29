import express from "express";
import mongoose from "mongoose";

const app = express();
const userRouter = require("./routers/user");
const vesselRouter = require("./routers/vessel");
const landingPageRouter = require("./routers/landingPage");

const cors = require("cors");
app.use(cors());

const expressGraphQL = require("express-graphql").graphqlHTTP;
const schema = require("./graphql/schema");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true,
  })
);
app.use(userRouter);
app.use(vesselRouter);
app.use(landingPageRouter);

mongoose.connect(
  process.env.MONGO_URI+''
);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("the app is listening at port " + port);
});
