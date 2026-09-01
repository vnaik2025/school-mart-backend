export const validate = (schemas) => {
  return (req, res, next) => {
    const validations = [];

    if (schemas.body) {
      validations.push(
        schemas.body.validateAsync(req.body, { abortEarly: false, stripUnknown: true })
          .then((validatedBody) => {
            req.body = validatedBody;
          })
      );
    }

    if (schemas.query) {
      validations.push(
        schemas.query.validateAsync(req.query, { abortEarly: false, stripUnknown: true })
          .then((validatedQuery) => {
            Object.defineProperty(req, 'query', { value: validatedQuery, writable: true, configurable: true });
          })
      );
    }

    if (schemas.params) {
      validations.push(
        schemas.params.validateAsync(req.params, { abortEarly: false, stripUnknown: true })
          .then((validatedParams) => {
            Object.defineProperty(req, 'params', { value: validatedParams, writable: true, configurable: true });
          })
      );
    }

    if (validations.length === 0) {
      return next();
    }

    Promise.all(validations)
      .then(() => next())
      .catch((err) => {
        next(err);
      });
  };
};
