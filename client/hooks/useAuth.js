import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { getUser, isLoggedIn } from '../utils/authUtil'
import useLogin from './useLogin'
import useLogout from './useLogout/index.js'
import useRegister from './useRegister'

const useAuth = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const [alreadyExist, setAlreadyExist] = useState(false)
    const [wrongPassword, setWrongPassword] = useState(false)

    const [user, setUser] = useState()

    const history = useHistory()

    const { register: registerFunc, loading: registerLoading } = useRegister({
        onRegister: () => {
            checkIsAuthenticated()
            //navigate back to home
            history.replace('/')
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
            //navigate back to home
            history.replace('/')
        },
        onError: (error) => {
            setError(error)
        },
        onWrongPassword: () => {
            setWrongPassword(true)
        }
    })

    const { logout, loading: logoutLoading, error: logoutError } = useLogout()

    /**
     * 
     */
    const checkIsAuthenticated = () => {
        setIsAuthenticated(isLoggedIn())
        setUser(getUser())
    }

    useEffect(() => {
        checkIsAuthenticated()
    }, [])

    useEffect(() => {
        if (registerLoading || logoutLoading || loginLoading) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [registerLoading, logoutLoading])


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
        wrongPassword
    }

}

export default useAuth