const AuthProvider = require("./client/components/auth-provider")
const useAuth = require("./client/hooks/useAuth")



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
    //the client side api
    useAuth,
    //wrap the components in the src/index file with AuthProvider
    AuthProvider
}