import { ENV } from "../../config/env.config";
import { User } from "../../models";
import { AuthUser } from "../auth/index";

export const refreshTokenUser = async (req, res) => {
  try {
    // get access token from header
    const { x_authorization } = req.headers;
    const { refresh_token } = req.body;
    const access_token_life = ENV.JWT_EXPIRATION;
    const access_token_secret = ENV.JWT_ENCRYPTION;

    const auth_user = new AuthUser();
    if (!x_authorization) {
      // if client not send access token
      return res.status(400).send("Access token not found.");
    }
    // get refresh token from body
    if (!refresh_token) {
      return res.status(400).send("No refresh token found.");
    }
    /*
      - decode this access token
      - decoded: {
          - payload: { email: 'binhdev@gmail.com' }
          - iat: 1664683897,
          - exp: 1664684497
        }
    */
    const decoded = auth_user.decodeToken({
      token: x_authorization,
      secret_key: access_token_secret,
    });
    if (!decoded) {
      return res.status(400).send("Invalid Access Token!.");
    }
    // get email from payload of decode data
    const email = decoded.payload.email;
    const user = await User.findOne({ where: { email } });
    // if user not found in system
    if (!user) {
      return res.status(401).send("User Not Found");
    }
    // if refresh_token in body of request are different from refresh token of user
    // save in system
    if (refresh_token !== user.refresh_token) {
      return res.status(400).send("Invalid Refresh Token");
    }
    // create new access token
    const data_for_access_token = {
      email,
    };
    const access_token = auth_user.generateToken({
      data_for_access_token,
      access_token_secret,
      access_token_life,
    });
    if (!access_token) {
      return res.status(400).send("Access token generation failed, please try again.");
    }
    return res.json({
      access_token,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send("Something went wrong, please try again");
  }
};
