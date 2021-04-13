
const context = ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || "";

    // console.log({token})

    // try to retrieve a user with the token
    const { payload: user, loggedIn } = getPayload(token);

    // add the user to the context
    return {
      user,
      loggedIn,
    };
  }

  module.exports = context