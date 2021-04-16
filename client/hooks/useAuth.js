import { useState, useEffect } from 'react'
import { getUser, isLoggedIn } from '../utils/authUtil'
import { HTTP_URL } from '../utils/url-util'
import useLogin from './useLogin'
import useLogout from './useLogout/index.js'
import useRegister from './useRegister'
import useForgotPassword from './useForgotPassword'


const useAuth = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()
    const [alreadyExist, setAlreadyExist] = useState(false)
    const [wrongPassword, setWrongPassword] = useState(false)
    const [nonExist, setNonExist] = useState(false)
    const [forgotPasswordSent, setForgotPasswordSent] = useState(false)


    const [user, setUser] = useState(getUser())

    const [requestComplete, setRequestComplete] = useState(false)


    useEffect(() => {
        setIsLoading(false)

        if (requestComplete && isAuthenticated) {
            setRequestComplete(false)
            //navigate back to home
            window.location.href = HTTP_URL
        }
    }, [requestComplete, isAuthenticated])

    const { register: registerFunc, loading: registerLoading } = useRegister({
        onRegister: () => {
            checkIsAuthenticated()
            setRequestComplete(true)
        },
        onError: (error) => {
            setError(error)
        },
        onAlreadyExists: () => {
            setAlreadyExist(true)
        }
    })

    const { login: loginFunc, loading: loginLoading } = useLogin({
        onLogin: () => {
            checkIsAuthenticated()
            setRequestComplete(true)
        },
        onError: (error) => {
            setError(error)
        },
        onWrongPassword: () => {
            setWrongPassword(true)
        }
    })

    const { resetPassword:resetPasswordFunc, loading: forgotPasswordLoading } = useForgotPassword({
        onForgotPassword: () => {
            setForgotPasswordSent(true)
        },
        onError: (error) => {
            setError(error)
        },
        onNotExist: () => {
            setNonExist(true)
        }
    })

    const { logout, loading: logoutLoading, error: logoutError } = useLogout()

    /**
     * 
     */
    const checkIsAuthenticated = () => {
        setUser(getUser())
        setIsAuthenticated(isLoggedIn())

    }

    useEffect(() => {
        checkIsAuthenticated()
    }, [])

    useEffect(() => {
        if (registerLoading || logoutLoading || loginLoading || forgotPasswordLoading) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [registerLoading, logoutLoading, loginLoading, forgotPasswordLoading])


    useEffect(() => {
        if (logoutError) {
            setError(true)
        } else {
            setError(false)
        }
    }, [logoutError])


    const register = ({ email, password }) => {
        setError(null)
        setAlreadyExist(null)
        registerFunc({ email, password })
    }

    const forgotPassword = (email) => {
        setForgotPasswordSent(false)
        setNonExist(false)
        resetPasswordFunc(email)
    }

    const login = ({ email, password }) => {
        setError(null)
        setAlreadyExist(null)
        loginFunc({ email, password })
    }

    return {
        login,
        register,
        logout,
        isAuthenticated,
        isLoading,
        user,
        error,
        //the user Already exists
        alreadyExist,
        wrongPassword,
        //the user doesnt exists
        nonExist,
        forgotPasswordSent,
        forgotPassword
    }

}

export default useAuth