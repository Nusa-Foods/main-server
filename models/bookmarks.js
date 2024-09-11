const { ObjectId } = require("mongodb");
const { database } = require("../config/mongo");
const bookmarksCollection = database.collection("bookmarks");

// Function to add a bookmark
async function addBookmark(ownerEmail, slug) {
    const existingBookmark = await bookmarksCollection.findOne({
        owner: ownerEmail,
    });

    if (existingBookmark) {
        const slugExists = existingBookmark.bookmarks.includes(slug);
        if (slugExists) {
            return { alreadyBookmarked: true };
        }

        const result = await bookmarksCollection.updateOne(
            { owner: ownerEmail },
            { $push: { bookmarks: slug } }
        );
        return result;
    } else {
        const newBookmark = {
            owner: ownerEmail,
            bookmarks: [slug],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await bookmarksCollection.insertOne(newBookmark);
        return result;
    }
}

// Function to remove a bookmark
async function removeBookmark(ownerEmail, slug) {
    const result = await bookmarksCollection.updateOne(
        { owner: ownerEmail },
        { $pull: { bookmarks: slug } }
    );
    return result;
}

// Function to get all bookmarks for a user
async function getBookmarksByUser(ownerEmail) {
    const bookmarks = await bookmarksCollection
        .aggregate([
            { $match: { owner: ownerEmail } },
            {
                $lookup: {
                    from: "recipes", // The name of your recipes collection
                    localField: "bookmarks",
                    foreignField: "slug",
                    as: "bookmarkedRecipes",
                },
            },
        ])
        .toArray();
    return bookmarks;
}

module.exports = {
    addBookmark,
    removeBookmark,
    getBookmarksByUser,
};
