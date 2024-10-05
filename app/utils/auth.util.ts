import jwt from 'jsonwebtoken';

const SECRET_KEY = 'password';
const EXPIRATION = '24h';

export const generateToken = (user: any) => {
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    {
      expiresIn: EXPIRATION,
    }
  );

  return token;
};

export const checkAuth = (ctx: any) => {
  const token = ctx.req.headers['x-auth-token'];

  if (!token) {
    throw new Error('Invalid token, permission denied.');
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    return user;
  } catch (err) {
    throw err;
  }
};
