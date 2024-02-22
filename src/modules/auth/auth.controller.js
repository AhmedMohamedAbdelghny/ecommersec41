import { nanoid } from "nanoid";
import userModel from "../../../DB/models/user.model.js";
import { emailFunc } from "../../services/sendEmail.js";
import { AppError, asyncHandler } from "../../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// ************************************signUp*************************************
export const signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password, phone, address } = req.body

    const emailExist = await userModel.findOne({ email: email.toLowerCase() })
    if (emailExist) {
        return next(new AppError("user already exist", 409))
    }
    const token = jwt.sign({ email }, process.env.SIGNATURE, { expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const rfToken = jwt.sign({ email }, process.env.SIGNATURE)
    const rfLink = `${req.protocol}://${req.headers.host}/auth/refreshToken/${rfToken}`
    const emailSend = emailFunc({
        email,
        subject: "confirm email",
        html: `<a href='${link}'>confirm email</a> <br>
        <a href='${rfLink}'>resend confirmEmail</a>`
    })
    if (!emailSend) {
        return next(new AppError("fail to send this email", 400))

    }
    const hash = bcrypt.hashSync(password, +process.env.SALT_ROUND)
    const user = await userModel.create({ name, email, password: hash, phone, address })

    user ? res.status(201).json({ msg: "done", user }) : next(new AppError("fail", 500))

})


// ************************************confirmEmail*************************************
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    if (!decoded?.email) {
        return next(new AppError("invalid token", 400))
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true }, { new: true })

    user ? res.status(201).json({ msg: "done" }) : next(new AppError("user not exist or already  confirmed plz log in", 400))

})


// ************************************refreshToken*************************************
export const refreshToken = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    if (!decoded?.email) {
        return next(new AppError("invalid token", 400))
    }
    const user = await userModel.findOne({ email: decoded.email, confirmed: false })
    if (!user) {
        return next(new AppError("user not exist or already  confirmed plz log in", 400))
    }
    const rfToken = jwt.sign({ email: user.email }, process.env.SIGNATURE, { expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${rfToken}`
    const emailSend = emailFunc({
        email: user.email,
        subject: "confirm email",
        html: `<a href='${link}'>confirm email</a> `
    })
    if (!emailSend) {
        return next(new AppError("fail to send this email", 400))

    }
    res.status(201).json({ msg: "done" })

})


// ************************************forgetPassword*************************************
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body

    const userExist = await userModel.findOne({ email })
    if (!userExist) {
        return next(new AppError("email not exist ", 404))
    }
    const code = nanoid(4)
    const emailSend = emailFunc({
        email,
        subject: "reset password",
        html: `<h1>code:${code}</h1>`
    })
    if (!emailSend) {
        return next(new AppError("fail to send this email", 400))
    }
    await userModel.updateOne({ email }, { forgetCode: code })
    res.status(200).json({ msg: "done" })

})



// ************************************resetPassword*************************************
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, code, password, rePassword } = req.body

    const userExist = await userModel.findOne({ email })
    if (!userExist) {
        return next(new AppError("email not exist ", 404))
    }
    if (userExist.forgetCode !== code) {
        return next(new AppError("invalid code ", 400))

    }
    const hash = bcrypt.hashSync(password, +process.env.SALT_ROUND)

    await userModel.updateOne({ email }, { password: hash, forgetCode: "", changePasswordAt: Date.now() })

    res.status(200).json({ msg: "done" })

})


// ************************************signIn*************************************
export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const userExist = await userModel.findOne({ email, confirmed: true })
    if (!userExist) {
        return next(new AppError("email not exist or not confirmed yet!! ", 404))
    }
    const match = bcrypt.compareSync(password, userExist.password)
    if (!match) {
        return next(new AppError("password not match!! ", 400))
    }
    const token = jwt.sign({ id: userExist._id, email, role: userExist.role }, process.env.SIGNATURE)
    await userModel.updateOne({ email }, { loggedIn: true })

    res.status(200).json({ msg: "done", token })

})