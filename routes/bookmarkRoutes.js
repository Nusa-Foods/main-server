const express = require("express");
const booksRouter = express.Router();
const bookmarkController = require("../controllers/bookmarkController");

// Route to add a bookmark
booksRouter.post("/", bookmarkController.addBookmarkHandler);
booksRouter.delete("/", bookmarkController.removeBookmarkHandler);
booksRouter.get("/", bookmarkController.getBookmarksHandler);

module.exports = booksRouter;
