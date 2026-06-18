import jwt from "jsonwebtoken"
import TokenBlacklist from "../models/tokenBlacklist.model.js"


async function authUser(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    // Check if token is blacklisted
    const isTokenBlacklisted = await TokenBlacklist.findOne({
        token
    })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid (blacklisted)"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token."
        })
    }

}


export { authUser }