const {validationResult} = require('express-validator')

module.exports = {
  handleError(renderView,errorMessage){
    return (req,res,next) =>{
      const {errors} = validationResult(req)
      if(errors.length > 0){
       
        if(errorMessage) req.session.error = errorMessage;  
        return res.render(renderView,{errors})
      }
      next()
    }
  }
}