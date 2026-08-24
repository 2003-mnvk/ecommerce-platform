import ApiError from '../utils/ApiError.js';

const validate = (schema) =>{
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if(!result.success){
            const errors = result.error.issues.map((issue) =>({
                field:issue.path.join("."),
                message: issue.message,
            }));

            return next(new ApiError(400, "Validation Failed", errors));
        }

        req.validated = result.data;

        next();

    };
};

export default validate;