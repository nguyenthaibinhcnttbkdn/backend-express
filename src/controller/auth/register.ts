import { User } from "../../models/index";
const bcrypt = require("bcrypt");
const salt_rounds = 10;

/*
   - status: 200 OK
   The request succeeded. The result meaning of "success" depends on the HTTP method

   - status: 409 Conflict
   The HTTP 409 Conflict response status code indicates a request conflict 
   with the current state of the target resource.
*/
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    // Check email already exists in the system or not
    if (user) {
      res.status(409).send("Email already exists");
    } else {
      // create new user if user not exist in system
      const hash_password = bcrypt.hashSync(password, salt_rounds);
      const new_user = {
        email,
        password: hash_password,
      };
      const created_user = await User.create(new_user);
      if (!created_user) {
        return res.status(400).send("There was an error during account creation, please try again");
      }
      return res.status(200).send({ email });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).send("There was an error during account creation, please try again");
  }
};
