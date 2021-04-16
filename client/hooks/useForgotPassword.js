
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { IS_LOGGED_IN, LOG_IN, RESET_PASSWORD } from '../constants/SigninGqlQueries'
import { isErrorCode, signin } from '../utils/authUtil'

const useForgotPassword = ({onForgotPassword,onError,onNotExist}) => {
    const history = useHistory()

    const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
        onError: (error) => {
            if (isErrorCode(error, 3)) {
                onNotExist()
            } else {
                onError()
            }
        },
        onCompleted: () => onForgotPassword(true)
    })

    const execute = (email) => {
        resetPassword({
            variables: {
                email: email,
            }
        })

    }

    return { resetPassword: execute, loading }

}

export default useForgotPassword