const { database } = require("../config/mongo");
const db = database.collection("forums");

// Forum data structure
function generateSlug(name) {
    return name.toLowerCase().replace(/\s+/g, "-");
}

async function createForum(forumData) {
    const newForum = {
        title: forumData.title.toUpperCase(), // Title converted to uppercase
        slug: generateSlug(forumData.title),
        content: forumData.content,
        imageUrl: forumData.imageUrl,
        createdBy: forumData.createdBy, // From req.user
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [], // Default empty array for comments
    };

    const result = await db.insertOne(newForum);
    return result;
}

async function getForumBySlug(slug) {
    const forum = await db.findOne({ slug: slug });
    return forum;
}

async function addCommentToForum(slug, commentData) {
    const result = await db.updateOne(
        { slug: slug },
        {
            $push: { comments: commentData },
            $set: { updatedAt: new Date() },
        }
    );
    return result;
}

module.exports = {
    createForum,
    getForumBySlug,
    addCommentToForum,
};
