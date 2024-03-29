const faker = require("faker");

const db = require("../config/connection");
const { Playlists, User } = require("../models");

db.once("open", async () => {
  await Playlists.deleteMany({});
  await User.deleteMany({});

  // create user data
  const userData = [];

  for (let i = 0; i < 50; i += 1) {
    const username = faker.internet.userName();
    const email = faker.internet.email(username);
    const password = faker.internet.password();

    userData.push({ username, email, password });
  }

  const createdUsers = await User.collection.insertMany(userData);

  // create friends
  for (let i = 0; i < 100; i += 1) {
    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { _id: userId } = createdUsers.ops[randomUserIndex];

    let friendId = userId;

    while (friendId === userId) {
      const randomUserIndex = Math.floor(
        Math.random() * createdUsers.ops.length
      );
      friendId = createdUsers.ops[randomUserIndex];
    }

    // update1: check to see if code breaks after deletion
    await User.updateOne({ _id: userId }, { $addToSet: { friends: friendId } });
  }

  // create playlists
  let createdPlaylists = [];
  for (let i = 0; i < 100; i += 1) {
    const playlistsName = faker.lorem.words(Math.round(Math.random() * 20) + 1);

    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { username, _id: userId } = createdUsers.ops[randomUserIndex];

    const createdPlaylists = await Playlists.create({
      playlistsName,
      username,
    });

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $push: { playlists: createdPlaylists._id } }
    );

    createdPlaylists.push(createdPlaylists);
  }

  // create reactions
  for (let i = 0; i < 100; i += 1) {
    const reactionBody = faker.lorem.words(Math.round(Math.random() * 20) + 1);

    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { username } = createdUsers.ops[randomUserIndex];

    const randomPlaylistsIndex = Math.floor(
      Math.random() * createdPlaylists.length
    );
    const { _id: playlistsId } = createdPlaylists[randomPlaylistsIndex];

    await Playlists.updateOne(
      { _id: playlistsId },
      { $push: { reactions: { reactionBody, username } } },
      { runValidators: true }
    );
  }

  console.log("all done!");
  process.exit(0);
});
