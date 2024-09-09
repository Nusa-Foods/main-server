const { createClient } = require("pexels");

const client = createClient(process.env.PEXELS_API);

const imgSearch = async (query) => {
    return client.photos.search({ query, per_page: 1 });
};

module.exports = {
    imgSearch,
};
