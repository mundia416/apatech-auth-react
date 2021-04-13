const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    primaryUserEmail: String
    email: String!
    password: String!
    token: String
    isLoggedIn: Boolean!
  }

  input UserInput {
    email: String!
    password: String!
  }

  input ChangePasswordInput {
    oldPassword: String!
    newPassword: String!
  }
`

