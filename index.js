"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const userRouter = require("./routers/user");
const vesselRouter = require("./routers/vessel");
const landingPageRouter = require("./routers/landingPage");
const cors = require("cors");
app.use(cors());
const expressGraphQL = require("express-graphql").graphqlHTTP;
const schema = require("./graphql/schema");
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb" }));
app.use("/graphql", expressGraphQL({
    schema,
    graphiql: true,
}));
app.use(userRouter);
app.use(vesselRouter);
app.use(landingPageRouter);
mongoose_1.default.connect(process.env.MONGO_URI + '');
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("the app is listening at port " + port);
});
