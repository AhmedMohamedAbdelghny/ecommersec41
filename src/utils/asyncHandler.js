export class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            next(err)
        })
    }
}

export const globalErrorHandling = (err, req, res, next) => {
    if (err) {
        if (process.env.MODE == "dev") {
            res.status(err.statusCode || 500).json({ err: err.message, statusCode: err.statusCode, stack: err.stack })
        } else {
            res.status(err.statusCode || 500).json({ err: err.message, statusCode: err.statusCode })
        }
    }
    next()

}