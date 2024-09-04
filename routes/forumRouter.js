const express = require("express");
const forumRouter = express.Router();
const ForumController = require("../controllers/forumController");

// Define routes for forum operations
forumRouter.post("/", ForumController.createForumHandler); // POST /forum - Create a new forum post
forumRouter.get("/:slug", ForumController.getForumBySlugHandler); // GET /forum/:slug - Get forum post by slug
forumRouter.post("/:slug/comment", ForumController.addCommentHandler); // POST /forum/:slug/comment - Add a comment to a forum post

module.exports = forumRouter;
