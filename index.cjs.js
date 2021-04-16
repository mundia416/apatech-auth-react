'use strict';

var useAuth = require("./client/hooks/useAuth");

var useChangePassword = require("./client/hooks/useChangePassword");

var getApolloClient = require("./client/getApolloClient");
/**
 * to use this library do the following
 */
//define the following variables in the env file

/**
 */


module.exports = {
  useAuth: useAuth,
  getApolloClient: getApolloClient,
  useChangePassword: useChangePassword
};
