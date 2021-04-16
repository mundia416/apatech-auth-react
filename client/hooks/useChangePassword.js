
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { CHANGE_TOKEN_PASSWORD, IS_LOGGED_IN, IS_PASSWORD_RESET_VALID, LOG_IN } from '../constants/SigninGqlQueries'
import { isErrorCode, signin } from '../utils/authUtil'

/**
 * should be called in the changePassword component.
 */
const useChangePassword = () => {
    const location = useLocation()
    const [invalid, setInvalid] = useState()
    const [success, setSuccess] = useState()




    const splitStrings = location.pathname.split('/')
    const token = splitStrings[splitStrings.length - 1]


    const { loading: fullScreenLoading, error: fullScreenError } = useQuery(IS_PASSWORD_RESET_VALID, {
        variables: { token },
        onCompleted: (data) => {
            if (data && data.isPasswordResetValid) {

            } else {
                setInvalid(true)
            }
        }
    })

    const [changePasswordMutate, { loading, error }] = useMutation(CHANGE_TOKEN_PASSWORD, {
        onCompleted: (data) => setSuccess(true)
    })

    const execute = (password) => {

        changePasswordMutate({
            variables: {
                password, token
            }
        })

    }

    return {
        changePassword: execute,
        fullScreenError,
        fullScreenLoading,
        loading,
        error,
        success,
        invalid
    }

}

export default useChangePassword
