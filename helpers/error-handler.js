function errorHandler(err, req, res, next) {
    if(err.name === 'UnauthorizedError'){
        //jwt Auth Error
        return res.status(401).json({message: "User Not Autorized."});
    }

    if(err.name === 'ValidationError'){
        //Validation error
        return res.status(401).json({message: err});
    }
    //Default error 500
    return res.status(500).json({message: err})
}

module.exports = errorHandler;