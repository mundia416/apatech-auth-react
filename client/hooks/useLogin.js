
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { IS_LOGGED_IN, LOG_IN } from '../constants/SigninGqlQueries'
import { isErrorCode, signin } from '../utils/authUtil'

const useLogin = ({onLogin,onError,onWrongPassword}) => {
    const history = useHistory()

    const [login, { loading }] = useMutation(LOG_IN, {
        onError: (error) => {
            if (isErrorCode(error, 9)) {
                onWrongPassword && onWrongPassword()
            } else {
                onError && onError(error)
            }
        },
        onCompleted: ({ login }) => {
            const { token, email } = login
            signin(token, email)

            onLogin && onLogin()
        },
        update: (cache) => {
            cache.writeQuery({
                query: IS_LOGGED_IN,
                data: { isLoggedIn: true }
            })
        },
    })

    const execute = ({email, password}) => {
    
        login({
            variables: {
                email: email,
                password: password
            }
        })

    }

    return { login: execute, loading }

}

export default useLogin