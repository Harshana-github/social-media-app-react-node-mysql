import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { db } from "../connect.js";
import { json } from "express";

export const register = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const getUserNameQuery = "SELECT * FROM users WHERE username = ?";

  db.query(getUserNameQuery, username, (error, data) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (data.length) {
      return res.status(409).json("User already exists!");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const email = req.body.email;
    const name = req.body.name;

    const registeredValue = [username, email, hashedPassword, name];

    const registerQuery =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUES (?)";

    db.query(registerQuery, [registeredValue], (error, data) => {
      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  const username = req.body.username;

  const getUserNameQuery = "SELECT * FROM users WHERE username = ?";
  db.query(getUserNameQuery, username, (error, data) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (data.length === 0) {
      return res.status(404).json("User not found!");
    }

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
    }).status(200).json("User has been logged out")
};
