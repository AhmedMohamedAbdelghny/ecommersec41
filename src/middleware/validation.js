let dataMethod = ["body", "params", "query", "headers", "file", "files"]


export const validation = (schema) => {
    return (req, res, next) => {
        let arrErrors = []
        dataMethod.forEach((key) => {
            if (schema[key]) {
                const { error } = schema[key].validate(req[key], { abortEarly: false })
                if (error?.details) {
                    arrErrors.push(...error.details)
                }
            }
        })
        if (arrErrors.length) {
            return res.json({ err: arrErrors.map(e => e.message) })
        }
        next()
    }
}



