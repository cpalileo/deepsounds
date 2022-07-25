const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const dateFormat = require("../utils/dateFormat");

const playlistsSchema = new Schema(
  {
    playlistsName: {
      type: String,
      required: "You need to leave a playlist!",
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

playlistsSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Playlists = model("Playlists", playlistsSchema);

module.exports = Playlists;
