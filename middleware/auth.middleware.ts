import { Request } from 'express';
import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';

import admin from '../firebaseAdmin';
import { jwtSecret } from '../config';

const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

export const checkAuth = async (req: Request) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  let authUser = null;

  if (token) {
    try {
      const decodedToken = await admin.auth().verifySessionCookie(token);
      authUser = decodedToken;
    } catch (error) {
      console.error('Firebase token verification failed:', error.message);
      throw new AuthenticationError(
        'Firebase token verification failed: ' + error.message
      );
    }
  }
  return { authUser };
};

module.exports.checkEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};


module.exports.genAndStoreToken = async (user, ctx) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    jwtSecret,
    { expiresIn }
  );

  await ctx.res.cookie('JWT_TOKEN', token, {
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 3600000
  });
};

module.exports.clearToken = async (ctx) => {
  const token = ctx.req.cookies.JWT_TOKEN;
  const googleIdToken = ctx.req.cookies.GOOGLE_ID_TOKEN;

  if (token) {
    await ctx.res.clearCookie('JWT_TOKEN', {
      httpOnly: true,
      sameSite: 'Strict'
    });
  }

  if (googleIdToken) {
    await ctx.res.clearCookie('GOOGLE_ID_TOKEN', {
      httpOnly: true,
      sameSite: 'Strict'
    });
  }
};
