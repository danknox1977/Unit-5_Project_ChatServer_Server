const errorResponse = (res, error) => {
    return(
        res.status(500).json(
            `Error: ${error.message}`
        )
    )
}

const successResponse = (res, results) => {
    return(res.status(200).json({results}))
}

const incompleteResponse = res => {
    return(res.status(404).send("Record was unable to be completed."))
}

module.exports = {
error: errorResponse,
success: successResponse,
incomplete: incompleteResponse

}
