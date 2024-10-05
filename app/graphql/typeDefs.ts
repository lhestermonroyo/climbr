import { gql } from 'apollo-server';

export default gql`
  scalar DateTime

  # User
  type Session {
    user: User!
    token: String!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    fullname: String!
    location: String!
    bio: String
    role: String
    created_at: DateTime!
  }
  input SignInInput {
    username: String!
    password: String!
  }
  input SignUpInput {
    username: String!
    email: String!
    password: String!
    confirm_password: String!
    fullname: String!
    location: String
    bio: String
    role: String!
  }
  input UpdateProfileInput {
    username: String
    email: String
    password: String
    confirm_password: String
    fullname: String
    location: String
    bio: String
    role: String
  }
  # Brand
  type Brand {
    id: ID!
    creator: String!
    name: String!
    description: String!
    thumbnail: String!
    created_at: DateTime!
  }
  input CreateBrandInput {
    name: String!
    description: String!
    thumbnail: String!
  }
  input UpdateBrandInput {
    name: String
    description: String
    thumbnail: String
  }
  # Category
  type Category {
    id: ID!
    creator: String!
    name: String!
    description: String!
    created_at: DateTime!
  }
  input CreateCategoryInput {
    name: String!
    description: String!
  }
  input UpdateCategoryInput {
    name: String
    description: String
  }
  # Shoe
  type Shoe {
    id: ID!
    creator: String!
    brand: String!
    category: String!
    name: String!
    description: String!
    release_date: String!
    gender: String!
    shoe_image: [ShoeImage]!
    shoe_link: [ShoeLink]!
    created_at: DateTime!
  }
  type ShoeImage {
    id: ID!
    shoe_id: String!
    image_url: String!
  }
  type ShoeLink {
    id: ID!
    shoe_id: String!
    link_url: String!
  }
  input CreateShoeInput {
    brand: String!
    category: String!
    name: String!
    description: String!
    release_date: String!
    gender: String!
    shoe_images: [String]!
    shoe_links: [String]!
  }
  input UpdateShoeInput {
    brand: String
    category: String
    name: String
    description: String
    release_date: String
    gender: String
    shoe_images: [String]
    shoe_links: [String]
  }

  # Query and Mutation
  type Query {
    getAllUsers: [User]!
    getUsersBy(params: UpdateProfileInput!): [User]!
    getProfile: User!
    getAllBrands: [Brand]!
    getBrandsBy(params: UpdateBrandInput!): [Brand]!
    getBrand(id: ID!): Brand!
    getAllCategories: [Category]!
    getCategoriesBy(params: UpdateCategoryInput!): [Category]!
    getCategory(id: ID!): Category!
    getAllShoes: [Shoe]!
    getShoesBy(params: UpdateShoeInput!): [Shoe]!
    getShoe(params: UpdateShoeInput!): Shoe!
  }
  type Mutation {
    signUp(payload: SignUpInput!): Session!
    signIn(payload: SignInInput!): Session!
    updateProfile(payload: UpdateProfileInput!): User!
    createBrand(payload: CreateBrandInput!): Brand!
    updateBrand(payload: UpdateBrandInput!, id: ID!): Brand!
    deleteBrand(id: ID!): [Brand]!
    createCategory(payload: CreateCategoryInput!): Category!
    updateCategory(payload: UpdateCategoryInput!, id: ID!): Category!
    deleteCategory(id: ID!): [Category]!
    createShoe(payload: CreateShoeInput!): Shoe!
    updateShoe(payload: UpdateShoeInput!, id: ID!): Shoe!
    deleteShoe(id: ID!): [Shoe]!
  }
`;
