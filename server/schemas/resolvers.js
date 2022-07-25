const { User, Playlists } = require("../models");

const resolvers = {
  Query: {
    playlists: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Playlists.find(params).sort({ createdAt: -1 });
    },
  },
};

module.exports = resolvers;
