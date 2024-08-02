class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        stack = "",
        errors = []
    ){  // override the Error classes constructor
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;   
        this.stack = stack;
        this.errors = errors;
        if(stack){  // checking if the error stack is empty or not
              this.stack = stack;
        }
        else{
           Error.captureStackTrace(this , this.constructor); // capture the error into stack
        }
    }
}

export {ApiError}