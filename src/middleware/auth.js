

import jwt from "jsonwebtoken"
import userModel from "../../DB/models/user.model.js"



export const auth = (roles = []) => {
    return async (req, res, next) => {
        const { token } = req.headers
        if (!token) {
            return res.status(404).json({ msg: "token not found" })
        }
        if (!token.startsWith(process.env.BEARER_KRY)) {
            return res.status(400).json({ msg: "invalid token" })
        }

        const baseToken = token.split(process.env.BEARER_KRY)[1]
        const decoded = jwt.verify(baseToken, process.env.SIGNATURE)

        if (!decoded) {
            return res.status(404).json({ msg: "invalid signature" })
        }
        if (!decoded.id) {
            return res.status(400).json({ msg: "invalid token payload" })
        }

        const user = await userModel.findById(decoded.id).select("-password")
        if (!user) {
            return res.status(404).json({ msg: "user not found" })
        }
        if (user.confirmed == false) {
            return res.status(404).json({ msg: "please confirm first" })
        }
        if (user.loggedIn == false) {
            return res.status(404).json({ msg: "please log in first" })
        }
        if (!roles.includes(user.role)) {
            return res.status(404).json({ msg: "not auth" })
        }

        if (parseInt(user?.changePasswordAt?.getTime() / 1000) > decoded.iat) {
            return res.status(404).json({ msg: "token expire" })
        }
        req.user = user
        next()
    }
}






