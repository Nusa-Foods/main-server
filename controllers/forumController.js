const {
    createForum,
    getForumBySlug,
    addCommentToForum,
} = require("../models/forum");

// Create a new forum post
async function createForumHandler(req, res) {
    try {
        const forumData = {
            title: req.body.title,
            content: req.body.content,
            imageUrl: req.body.imageUrl,
            createdBy: req.user.name, // Assuming user name is stored in req.user
        };

        const result = await createForum(forumData);
        res.status(201).json({
            message: "Forum created successfully",
            forumId: result.insertedId,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create forum",
            error: error.message,
        });
    }
}

// Get forum post by slug
async function getForumBySlugHandler(req, res) {
    try {
        const slug = req.params.slug;
        const forum = await getForumBySlug(slug);

        if (forum) {
            res.status(200).json(forum);
        } else {
            res.status(404).json({ message: "Forum not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to get forum",
            error: error.message,
        });
    }
}

// Add a comment to a forum post
async function addCommentHandler(req, res) {
    try {
        const slug = req.params.slug;
        const commentData = {
            user: req.user.name, // Assuming user name is stored in req.user
            comment: req.body.comment,
            createdAt: new Date(),
        };

        const result = await addCommentToForum(slug, commentData);
        if (result.modifiedCount > 0) {
            res.status(201).json({ message: "Comment added successfully" });
        } else {
            res.status(404).json({ message: "Forum not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to add comment",
            error: error.message,
        });
    }
}

module.exports = {
    createForumHandler,
    getForumBySlugHandler,
    addCommentHandler,
};
