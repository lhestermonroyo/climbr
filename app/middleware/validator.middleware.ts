import { check } from 'express-validator';

// ------------ user validators ------------ //
export const signUpValidator = [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  check('fullname', 'Fullname is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty(),
  check('bio', 'Bio is required').not().isEmpty(),
  check('role', 'Role is required').isIn(['user', 'admin']),
];

export const signInValidator = [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
];
// ------------ brand validators ------------ //
export const createBrandValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('thumbnail', 'Thumbnail is required').not().isEmpty(),
];
// ------------ category validators ------------ //
export const createCategoryValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
];