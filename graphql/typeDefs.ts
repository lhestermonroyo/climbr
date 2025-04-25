import { gql } from 'apollo-server';

export default gql`
  scalar DateTime
  # User
  type User {
    id: ID!
    email: String!
    phone_number: String!
    first_name: String!
    last_name: String!
    pronoun: String!
    birth_date: DateTime!
    location: String!
    avatar: String!
    created_at: DateTime!
  }

  input SignUpInput {
    email: String!
    password: String!
    confirmPassword: String!
    firstName: String!
    lastName: String!
  }

  # Query and Mutation
  type Mutation {
    signUp(signUpInput: SignUpInput): User!
  }
  type Query {
    getUsers: [User]!
  }
`;
