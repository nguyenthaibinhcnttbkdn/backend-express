import * as express from "express";
import { registerUser } from "../controller/auth/register";
import { loginUser } from "../controller/auth/login";
import { refreshTokenUser } from "../controller/auth/refresh";
export const auth_route = express.Router();
auth_route.post("/register", registerUser);
auth_route.post("/login", loginUser);
auth_route.post("/refresh", refreshTokenUser);
