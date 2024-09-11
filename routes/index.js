const express = require("express");
const userRouter = require("./userRoutes");
const aiRouter = require("./aiRouter");
const recipeRouter = require("./recipeRouter");
const eventRouter = require("./eventRouter");
const authentication = require("../middleware/authentication");
const nusaRouter = require("./nusaRouter");
const booksRouter = require("./bookmarkRoutes");
const adminRouter = require("./adminRouter");
const routes = express.Router();

routes.use("/user", userRouter); // test done
routes.use("/ai", aiRouter); // test done
routes.use("/recipe", authentication, recipeRouter); //test done
routes.use("/event", authentication, eventRouter); // test done
routes.use("/bookmarks", authentication, booksRouter); // test done
routes.use("/nusa", nusaRouter); // test done
routes.use("/admin", adminRouter); // test done

module.exports = routes;
