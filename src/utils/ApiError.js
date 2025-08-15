class Apierror extends Error {
    constructor (
        statuscode,
        message = "something went wrong",
        errors =[],
        statck= ""
    ){
        super(message);
        this.statuscode = statuscode;
        this.errors = errors;
        this.data = null;
        this.message = message;
        this.success = false;
        this.statck = statck;
    }
}

export default Apierror ;