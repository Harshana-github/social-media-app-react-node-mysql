import { db } from "../connect.js";

export const getPosts = (req, res) => {
  const getPostsQuery = `SELECT posts.*, users.id AS userId, users.name, users.profilePic FROM posts JOIN users ON users.id = posts.userId;`;
  db.query(getPostsQuery, (error, data) => {
    if (error) {
      return res.status(500).json(error);
    }

    return res.status(200).json(data);
  });
};
