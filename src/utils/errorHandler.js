// class ErrorHandler extends Error{//JavaScript-ல already இருக்கும் Error class-ஐ extend பண்ணி, நம்மோட custom error class create பண்ணுறோம்.
//     constructor(message,statusCode){  //error create பண்ணும்போது message (உதாரணம்: "User not found") & statusCode
//         super(message)//→ parent class (Error)-க்கு அந்த message-ஐ அனுப்புறது.
//         this.statusCode=statusCode;//அந்த errorக்கு HTTP status code attach ஆகும் (400, 404, 500 போன்றவை).
//         Error.captureStackTrace(this,this.constructor)//→ error எங்க throw ஆச்சு, எந்த file/line-ல ஆச்சு என்ற trace-ஐ clean-ஆக் காட்ட உதவும்.
//     }
// }    //main purpose -- நம்ம தேவைக்கேற்ப நாம create பண்ணுறது தான் custom error class:

// module.exports=ErrorHandler


function ErrorHandler(message, statusCode) {
  // new Error object create pannrom
  const error = new Error(message);

  // custom property attach pannrom
  error.statusCode = statusCode;

  // error stack trace clean pannrom (Error எங்க throw ஆனது மட்டும் காட்டும்)
  Error.captureStackTrace(error, ErrorHandler);

  return error; // custom error return pannrom
}

module.exports = ErrorHandler;


