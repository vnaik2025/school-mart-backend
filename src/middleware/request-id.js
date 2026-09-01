import crypto from 'crypto';

export const requestId = (req, res, next) => {
  const rid = req.headers['x-request-id'] || crypto.randomUUID();
  req.rid = rid;
  res.setHeader('x-request-id', rid);
  next();
};
