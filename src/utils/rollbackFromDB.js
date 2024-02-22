

export const rollbackFromDB = asyncHandler(async (req, res, next) => {
    if (req.savedDocument) {
        const { Model, id } = req.savedDocument
        await Model.findOneAndDelete({ _id: id })
    }
})