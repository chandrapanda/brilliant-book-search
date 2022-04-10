const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  // Queries
  Query: {
    users: async () => {
      return User.find();
    },

    users: async (parent, { bookId }) => {
      return User.findOne({ _id: bookId });
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context / user._id });
      }
      throw new AuthenticationError("Please log in!");
    },
  },
  // Mutations
  Mutation: {
    //Login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No profile with this email found.");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password.");
      }

      const token = signToken(user);
      return { token, user };
    },

    //Add a new user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    // TODO: Save a book to user's collection (subdocument)
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        return User.findOneAndUpdate({ _id: bookId }, {}, {}, {});
      }
    },

    // Remove a book from a user's collection
    removeBook: async (parent, { book }, context) => {
      if (context.user) {
        return User.findOneAndDelete({ _id: context.book._id });
      }
      throw new AuthenticationError("Please log in first.");
    },
  },
};

module.exports = resolvers;
