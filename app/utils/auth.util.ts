import jwt from 'jsonwebtoken';

const SECRET_KEY = 'password';
const EXPIRATION = '24h';

export const generateToken = (user: any) => {
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: EXPIRATION,
  });

  return token;
};

export const checkAuth = (req: any, res: any, next: any) => {
  const token = req.headers['x-auth-token'];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Invalid token, permission denied.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    throw err;
  }
};
