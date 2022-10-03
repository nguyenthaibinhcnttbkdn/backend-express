const jwt = require("jsonwebtoken");
interface token_config {
  data_for_access_token: object;
  access_token_secret: string;
  access_token_life: string;
}

interface decode_token_config {
  token: string;
  secret_key: string;
}

export class AuthUser {
  constructor() {}

  /*
    - todo: function to genearate new access token for user
    - data_for_access_token: {
        email : email of user
      }
    - access_token_secret: secret key of system
    - access_token_life: life cycle of access token
  */
  generateToken(token_config: token_config) {
    try {
      const algorithm = "HS256";
      const { data_for_access_token, access_token_secret, access_token_life } = token_config;
      return jwt.sign(
        {
          payload: data_for_access_token,
        },
        access_token_secret,
        {
          algorithm,
          expiresIn: access_token_life,
        }
      );
    } catch (error) {
      console.log(`Error in generate access token:  + ${error}`);
      return null;
    }
  }
  /*
    - todo: function to decode token at header of request
    - token: token at header of request
    - secret_key: secret key of system
  */
  decodeToken(decode_token_config: decode_token_config) {
    try {
      const { token, secret_key } = decode_token_config;
      return jwt.verify(token, secret_key, {
        ignoreExpiration: true,
      });
    } catch (error) {
      console.log(`Error in decode access token: ${error}`);
      return null;
    }
  }
}
