import Cookies from 'universal-cookie';
import { BASE_URL, HTTP_URL, isDev } from '../url-util'
import validator from 'validator'

const cookies = new Cookies();

if (process.env.NODE_ENV === 'test') {
    cookies.HAS_DOCUMENT_COOKIE = false
}


export const getOptions = () => {
    
    const options = {
        path: '/',
        domain: '.' + BASE_URL,
    }

    const devOptions = {
        path: '/',
    }

    if (isDev){
        return devOptions
    }else{
        return options
    }
}


const isTokenLoggedIn = (token) => {
    return token && token.length > 10
}

export const isLoggedIn = () => {
    const token = getToken()
    const loggedIn = isTokenLoggedIn(token)
    return loggedIn
}

export const getToken = () => {
    const token = cookies.get('jwt')
    return token
}

export const getEmail = () => {
    const email = cookies.get('email')
    return email
}

export const getUser = () => {
    const email = getEmail()
    const token = getToken()

    return { email, token }
}

export const signin = (token, email) => {
    cookies.set('email', email, getOptions())
    cookies.set('jwt', token, getOptions())
}

export const signout = () => {
    cookies.set('email', 'email', getOptions())
    cookies.set('jwt', 'token', getOptions())
}



export const isValidPassword = password => password.length >= 6

export const isValidEmail = email => {
    const finalEmail = typeof email === 'undefined' ? '' : email

    return validator.isEmail(finalEmail)
}

export const isErrorCode =(error, code) => error.message === `GraphQL error: ${code}`
