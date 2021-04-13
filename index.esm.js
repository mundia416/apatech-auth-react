var context = require("./server/context");

var userResolvers = require("./server/resolvers/userResolver");

var secondaryUserResolvers = require("./server/resolvers/secondaryUserResolver");

var AuthProvider = require("./client/components/auth-provider");

var userTypeDef = require("./server/typedefs/user");

var useAuth = require("./client/hooks/useAuth");
/**
 * to use this library do the following
 */
//define the following variables in the env file

/**
 
SENDGRID_API_KEY=
//the email address that password reset emails are sent from
SENDGRID_FROM_EMAIL=
//the url of the site
BASE_URL=

 */


module.exports = {
  //1. add the context object to ApolloServer object
  context: context,
  //2. add the userResolver to the resolvers index
  userResolvers: userResolvers,
  //3. add the userTypeDef to the typedefs index
  userTypeDef: userTypeDef,
  //4.[optional] add the secondaryUserResolver to the resolvers index if using secondary logins
  secondaryUserResolvers: secondaryUserResolvers,
  //the client side api
  useAuth: useAuth,
  //wrap the components in the src/index file with AuthProvider
  AuthProvider: AuthProvider
};
