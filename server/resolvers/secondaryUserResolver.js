const { getToken, encryptPassword, comparePassword, isResetPasswordTokenExpired } = require("../utils")
const { AuthenticationError } = require('apollo-server-express');
const UserModel = require('../models/SecondaryUserModel')
const constants = require('../constants')
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto')


module.exports = {
    Query: {
        user: async (_, __, context) => {
            if (context.loggedIn) {
                return await UserModel.findOne({ email: context.user.email.toLowerCase() })
            } else {
                //not logged in, log in again
                throw new AuthenticationError(constants.WRONG_PASSWORD)
            }
        },
        isPasswordResetValid: async (_, { token }) => {
            const user = await UserModel.findOne({ resetPasswordToken: token })
            let response

            if (user) {
                response = !isResetPasswordTokenExpired(user.resetPasswordExpires)
                //check if the token has expired
            } else {
                response = false
            }

            return response
        },

        isLoggedIn: async (_, __, context) => {


            if (context.user) {
                const email = context.user.email.toLowerCase()
                const queryParams = { email }

                const dbUser = await UserModel.findOne(queryParams)
                if (dbUser) {
                    return dbUser.isLoggedIn
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    },
    Mutation: {


        register: async (parent, args, context, info) => {
            // Check conditions
            const user = await UserModel.findOne({ email: args.user.email.toLowerCase() })
            if (user) {
                //user already exists
                throw new AuthenticationError(constants.USER_ALREADY_EXISTS)
            }

            try {

                const model = new UserModel()
                model.email = args.user.email.toLowerCase()
                model.password = await encryptPassword(args.user.password)
                model.isLoggedIn = true
                model.usesShopify = args.user.usesShopify
                model.showCC = true

                const { email, password } = await model.save()

                const token = getToken({ email, password });

                sgMail.setApiKey(process.env.SENDGRID_API_KEY);


                const address = email.split('@').pop()

                if (address.toLowerCase() !== 'test.com') {
                    await context.dataSources.sendgridAPI.newContact(email.toLowerCase())
                    await context.dataSources.slackAPI.newUser(email.toLowerCase(), args.utm)
                }

                return { email, password, token }
            } catch (e) {
                throw e
            }
        },

        logout: async (_, __, context) => {
            if (context.user) {
                const response = await UserModel.findOneAndUpdate({ email: context.user.email.toLowerCase() }, { isLoggedIn: false })
                if (response) {
                    return true
                } else {

                    return false
                }
            } else {
                return false
            }
        },

        login: async (parent, args, context, info) => {
            const email = args.user.email.toLowerCase()

            const user = await UserModel.findOne({ email })

            if (user) {
                await UserModel.findOneAndUpdate({ email: user.email.toLowerCase() }, { isLoggedIn: true })

                const { email, password } = user
                const isMatch = await comparePassword(args.user.password, password)
                if (isMatch) {
                    const token = getToken({ email: email.toLowerCase(), password })
                    return { email, password, token, isLoggedIn: true };
                } else {
                    throw new AuthenticationError(constants.WRONG_PASSWORD)
                }
            } else {
                throw new AuthenticationError(constants.WRONG_PASSWORD)
            }
        },
        //hard change the password using a token
        changeTokenPassword: async (_, args) => {
            const user = await UserModel.findOne({ resetPasswordToken: args.token })

            try {
                if (isResetPasswordTokenExpired(user.resetPasswordExpires)) {
                    throw new AuthenticationError(constants.EXPIRED)
                } else {
                    const newPassword = await encryptPassword(args.password)
                    const token = getToken({ email: user.email, password: newPassword })
                    const updateFields = {
                        password: newPassword,
                        resetPasswordExpires: null,
                        resetPasswordToken: null
                    }

                    await UserModel.findOneAndUpdate({ resetPasswordToken: args.token }, updateFields)

                    return { email: user.email, password: newPassword, token }
                }
            } catch (e) {
                throw new AuthenticationError(constants.EXPIRED)
            }
        },

        changePassword: async (parent, args, context, info) => {
            const { email, password } = await UserModel.findOne({ email: context.user.email })
            const { oldPassword, newPassword } = args
            const isMatch = await comparePassword(oldPassword, password)

            const newEncryptPassword = await encryptPassword(newPassword)
            if (isMatch) {
                await UserModel.findOneAndUpdate({ email: email }, { password: newEncryptPassword })
                const token = getToken({ email, newEncryptPassword })
                return { email, password, token };
            } else {
                throw new AuthenticationError(constants.WRONG_PASSWORD)
            }
        },

        resetPassword: async (_, { email }) => {
            //check if a user with the email address exists in the database
            const user = await UserModel.findOne({ email: email.toLowerCase() })
            if (!user) {
                throw new AuthenticationError(constants.EMAIL_NON_EXIST)
            }

            const resetToken = crypto.randomBytes(20).toString('hex')

            //store the resetToken and expires into the database
            await UserModel.findOneAndUpdate({ email: email }, {
                resetPasswordToken: resetToken,
                //expires after 1 hour
                resetPasswordExpires: Date.now() + 360000
            })


            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const msg = {
                to: email,
                from: process.env.SENDGRID_FROM_EMAIL,
                subject: 'Password Reset',
                text: `
                You have requested assistance in resetting your password. To do so, 
                you will need to click on the following link and follow the instructions given to you.

Click here to reset your password: ${process.env.BASE_URL}/reset/${resetToken}
              
              `,
            };

            await sgMail.send(msg);


            // let finalResponse

            // if (info.accepted.length > 0) {
            return constants.SUCCESS
            //} else {
            //    throw new AuthenticationError('failed to send email')
            // }

            // return finalResponse
        }

    }
};
