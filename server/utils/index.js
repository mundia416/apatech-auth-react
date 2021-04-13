const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const { NOT_LOGGED_IN } = require('../constants')
const { AuthenticationError } = require('apollo-server-express');

const isLoggedIn = (context) => {
	const user = context.user
	if (!user) {
		throw new AuthenticationError(NOT_LOGGED_IN)
	}
}

const encryptPassword = password => new Promise((resolve, reject) => {
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			reject(err)
			return false
		}
		bcrypt.hash(password, salt, (err, hash) => {
			if (err) {
				reject(err)
				return false
			}
			resolve(hash)
			return true
		})
	})
})

const comparePassword = (password, hash) => new Promise(async (resolve, reject) => {
	try {
		const isMatch = await bcrypt.compare(password, hash)
		resolve(isMatch)
		return true
	} catch (err) {
		reject(err)
		return false
	}
})

const getToken = payload => {
	const token = jwt.sign(payload, process.env.SECRET/*, {
        expiresIn: 604800, // 1 Week
	}*/)
	console.log({ getToken: token })
	return token
}

const getPayload = token => {
	try {
		const payload = jwt.verify(token, process.env.SECRET);
		return { loggedIn: true, payload };
	} catch (err) {
		// Add Err Message
		return { loggedIn: false }
	}
}

const isResetPasswordTokenExpired = (token) => {
	return (Date.now > parseInt(token))
}

module.exports = {
	isResetPasswordTokenExpired,
	getToken,
	getPayload,
	encryptPassword,
	comparePassword,
	isLoggedIn
}