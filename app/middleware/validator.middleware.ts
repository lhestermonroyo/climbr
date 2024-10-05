export const validateSignUp = (payload: any) => {
  const { username, email, password, confirm_password, fullname, role } =
    payload;

  const errors: any = {};

  if (username.trim() === '') {
    errors.username = 'Username is required';
  }

  if (email.trim() === '') {
    errors.username = 'Username must not be empty.';
  } else {
    const regEx = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address.';
    }
  }

  if (password === '') {
    errors.password = 'Password must not be empty.';
  } else {
    if (password !== confirm_password) {
      errors.confirm_password = 'Passwords must match.';
    }
  }

  if (fullname.trim() === '') {
    errors.fullname = 'Fullname must not be empty.';
  }

  if (role.trim() === '') {
    // role should be user or admin
    errors.role = 'Role must not be empty.';
  } else {
    if (role !== 'user' && role !== 'admin') {
      errors.role = 'Role must be user or admin.';
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateSignIn = (payload: any) => {
  const { username, password } = payload;

  const errors: any = {};

  if (username.trim() === '') {
    errors.username = 'Username is required';
  }

  if (password === '') {
    errors.password = 'Password must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateBrand = (payload: any) => {
  const { name, description, thumbnail } = payload;

  const errors: any = {};

  if (name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (description.trim() === '') {
    errors.description = 'Description is required';
  }

  if (thumbnail.trim() === '') {
    errors.thumbnail = 'Thumbnail is required';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateCategory = (payload: any) => {
  const { name, description } = payload;

  const errors: any = {};

  if (name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (description.trim() === '') {
    errors.description = 'Description is required';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateCreateShoe = (payload: any) => {
  const {
    brand,
    category,
    name,
    description,
    release_date,
    gender,
    shoe_images,
    shoe_links,
  } = payload;

  const errors: any = {};

  if (brand.trim() === '') {
    errors.brand = 'Brand is required';
  }

  if (category.trim() === '') {
    errors.category = 'Category is required';
  }

  if (name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (description.trim() === '') {
    errors.description = 'Description is required';
  }

  if (release_date.trim() === '') {
    errors.release_date = 'Release date is required';
  }

  if (gender.trim() === '') {
    errors.gender = 'Gender for shoe is required';
  }

  if (shoe_images.length < 1) {
    errors.shoe_images = 'Shoe images are required';
  }

  if (shoe_links.length < 1) {
    errors.shoe_links = 'Shoe links are required';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
