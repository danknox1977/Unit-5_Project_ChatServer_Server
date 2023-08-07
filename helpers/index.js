const errorResponse = (res, error) => {
    res.status(500).json(
            `Error: ${error.message}`
        
    )
}

const successResponse = (res, results) => {
    res.status(200).json({results})
}

const incompleteResponse = res => {
    res.status(404).send("Record was unable to be completed.")
}

module.exports = {
error: errorResponse,
success: successResponse,
incomplete: incompleteResponse

}
