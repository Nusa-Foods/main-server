const express = require("express");
const forumRouter = express.Router();
const ForumController = require("../controllers/forumController");

// Define routes for forum operations
forumRouter.post("/", ForumController.createForumHandler);
forumRouter.get("/:slug", ForumController.getForumBySlugHandler);
forumRouter.post("/:slug/comment", ForumController.addCommentHandler);

module.exports = forumRouter;
