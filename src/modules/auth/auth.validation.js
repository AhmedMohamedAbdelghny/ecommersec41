
import joi from "joi"
import { generalFiled } from "../../utils/generalField.js"

export const signUp = {
    body: joi.object().keys({
        name: joi.string().min(2).max(15).alphanum().required(),
        email: generalFiled.email,
        password: generalFiled.password,
        rePassword: generalFiled.rePassword,
        phone: joi.string().regex(/^01[0125][0-9]{8}$/).required(),
        address: joi.string().required()
    }).required()
}


export const confirmEmail = {
    params: joi.object().keys({
        token: joi.string().required()
    }).required()
}


export const forgetPassword = {
    body: joi.object().keys({
        email: generalFiled.email,
    }).required()
}

export const resetPassword = {
    body: joi.object().keys({
        email: generalFiled.email,
        code: joi.string().required(),
        password: generalFiled.password,
        rePassword: generalFiled.rePassword,
    }).required()
}


export const signIn = {
    body: joi.object().keys({
        email: generalFiled.email,
        password: generalFiled.password,
    }).required()
}