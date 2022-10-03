import { ENV } from "../../config/env.config";
import { User } from "../../models";
import { AuthUser } from "../auth/index";
const bcrypt = require("bcrypt");
const randtoken = require("rand-token");

/*
    - status: 400 (Bad Request)
    The server cannot or will not process the request due to something that is perceived to be a client error 
    (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).

    - status: 401 (Unauthorized)
    Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". 
    That is, the client must authenticate itself to get the requested response.

*/
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const access_token_life = ENV.JWT_EXPIRATION;
    const access_token_secret = ENV.JWT_ENCRYPTION;
    const default_token_size = 16;
    const data_for_access_token = {
      email,
    };
    const auth_user = new AuthUser();
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send("Username does not exist..");
    }
    // Check if the password from the client and the password from the client are the same
    const is_password_valid = bcrypt.compareSync(password, user.password);
    if (!is_password_valid) {
      return res.status(401).send("Incorrect password.");
    }
    // generate access token
    const access_token = auth_user.generateToken({
      data_for_access_token,
      access_token_secret,
      access_token_life,
    });
    // if cannot create access token
    if (!access_token) {
      return res.status(401).send("Login failed, please try again.");
    }
    // generate refresh token with default size
    let refresh_token = randtoken.generate(default_token_size);
    // if user not have refresh tokebn, save refresh_token for this user
    if (!user.refresh_token) {
      await user.update({ refresh_token });
    } else {
      // if user have refresh_token, get this refresh_token
      refresh_token = user.refresh_token;
    }
    return res.json({
      msg: "Login Sucessfully!",
      access_token,
      refresh_token,
      user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send("There was an error during account login, please try again");
  }
};
