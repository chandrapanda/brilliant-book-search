const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  // Queries
  Query: {
    // Finds one user by their own login credentials
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("books");
      }
      throw new AuthenticationError("Please log in!");
    },
  },
  // Mutations
  Mutation: {
    //Login
    loginUser: async (parent, { email, password }) => {
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

    // Save a book to user's collection (subdocument)
    saveBook: async (parent, { book }, { user }) => {
      // Throw error if user not passed in the context
      if (!user) throw new AuthenticationError("You need to be logged in!");

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $addToSet: {
            savedBooks: book,
          },
        },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },

    // Remove a book from a user's collection
    removeBook: async (parent, { bookId }, { user }) => {
      // Throw error if user not passed in the context
      if (!user) throw new AuthenticationError("You need to be logged in!");

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
