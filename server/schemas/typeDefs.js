// import the gql tagged template function
const { gql } = require("apollo-server-express");

// create our typeDefs

const typeDefs = gql`
  type Playlists {
    _id: ID
    playlistsName: String
    createdAt: String
    username: String
  }
  type Query {
    playlists(username: String): [Playlists]
  }
`;

// export the typeDefs
module.exports = typeDefs;
