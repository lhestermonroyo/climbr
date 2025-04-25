export type UserType = {
  email: string;
  password: string | null;
  firstName: string;
  lastName: string;
  pronouns: string | null;
  location: string | null;
  birthdate: string | null;
  bio: string | null;
  avatar: string | null;
  socials: {
    facebook: string | null;
    twitter: string | null;
    tiktok: string | null;
    instagram: string | null;
    threads: string | null;
    youtube: string | null;
  };
  createdAt: string;
};

export type SessionUser = Pick<UserType, 'email' | 'avatar'> & {
  verified: boolean;
};

export type SignUpInput = Partial<UserType> & {
  confirmPassword: string;
};

export type LoginInput = Pick<UserType, 'email' | 'password'>;
