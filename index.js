const useAuth = require("./client/hooks/useAuth")
const useChangePassword = require("./client/hooks/useChangePassword")
const getApolloClient = require("./client/getApolloClient")




/**
 * to use this library do the following
 */

//define the following variables in the env file
/**
 */

module.exports = {
    useAuth,
    getApolloClient,
    useChangePassword
}