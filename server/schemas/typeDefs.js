const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    bookId: ID
    authors: [String]!
    description: String
    title: String
    # TODO: IS THIS CORRECT TO REF IMAGE?
    image: image
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }
`;
