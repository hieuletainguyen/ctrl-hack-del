import express from "express";
import { Router } from "express";
import * as account from "../controllers/accounts.js";  // Note: ensure this file has .js extension
import { body } from "express-validator";

const router = Router();

router.post("/add-account", 
    body("username").not().isEmpty().escape(),
    body("password").not().isEmpty().escape(),
    account.addAccount
);

router.post("/auth", 
    body("username").not().isEmpty().escape(),
    body("password").not().isEmpty().escape(),
    account.authentication
);

router.post("/logout", account.logout);

router.post("/decode_token", account.decode_token);

router.get("/get_account", account.getAccount);

export default router;

