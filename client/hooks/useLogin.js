
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { IS_LOGGED_IN, LOG_IN } from '../constants/SigninGqlQueries'
import { signin } from '../utils/authUtil'

const useLogin = ({onLogin,onError}) => {
    const history = useHistory()

    const [login, { loading }] = useMutation(LOG_IN, {
        onError: onError,
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

    const execute = (email, password) => {
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