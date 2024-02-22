import { Router } from "express"
import * as AV from "./auth.validation.js";
import * as AC from "./auth.controller.js";
import { validation } from './../../middleware/validation.js';

const router = Router()



router.post("/signUp", validation(AV.signUp), AC.signUp)
router.get("/confirmEmail/:token", validation(AV.confirmEmail), AC.confirmEmail)
router.get("/refreshToken/:token", validation(AV.confirmEmail), AC.refreshToken)
router.patch("/sendCode", validation(AV.forgetPassword), AC.forgetPassword)
router.patch("/resetPassword", validation(AV.resetPassword), AC.resetPassword)
router.post("/signIn", validation(AV.signIn), AC.signIn)




export default router