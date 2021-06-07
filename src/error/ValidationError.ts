class ValidationError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
        this.name = 'E_MISSING_OR_INVALID_PARAMS';
    }
}

export default ValidationError;
