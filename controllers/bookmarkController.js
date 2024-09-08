const bookmarkModel = require("../models/bookmarks");

// Controller to add a bookmark
async function addBookmarkHandler(req, res) {
    const { slug } = req.body;
    const ownerEmail = req.user.email;

    console.log(req.body);

    try {
        const result = await bookmarkModel.addBookmark(ownerEmail, slug);

        if (result.alreadyBookmarked) {
            return res
                .status(400)
                .json({ message: "Recipe is already bookmarked." });
        }

        res.status(200).json({
            message: "Bookmark added successfully.",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to add bookmark.",
            error: error.message,
        });
    }
}

// Controller to remove a bookmark
async function removeBookmarkHandler(req, res) {
    const { slug } = req.body;
    const ownerEmail = req.user.email;

    try {
        const result = await bookmarkModel.removeBookmark(ownerEmail, slug);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Bookmark not found." });
        }

        res.status(200).json({ message: "Bookmark removed successfully." });
    } catch (error) {
        res.status(500).json({
            message: "Failed to remove bookmark.",
            error: error.message,
        });
    }
}

async function getBookmarksHandler(req, res) {
    const ownerEmail = req.user.email;

    try {
        const bookmarks = await bookmarkModel.getBookmarksByUser(ownerEmail);
        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve bookmarks.",
            error: error.message,
        });
    }
}

module.exports = {
    addBookmarkHandler,
    removeBookmarkHandler,
    getBookmarksHandler,
};
