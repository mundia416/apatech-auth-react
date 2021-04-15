
import { useMutation } from '@apollo/react-hooks'
import { IS_LOGGED_IN, LOGOUT } from '../../constants/SigninGqlQueries'
import { HTTP_URL } from '../../utils/url-util'
import { signout } from '../../utils/authUtil'

const useLogout = () => {

    const [logout,{loading,error}] = useMutation(LOGOUT, {
        onError: error => { console.log(error)},
        onCompleted: (data) => {
            if (data.logout) {

                signout()
                window.location.href = HTTP_URL
                //todo show toast that you have logged out or try again if something went wrong
            }
        },
        update: (cache, { data }) => {
            if (data.logout) {
                cache.writeQuery({
                    query: IS_LOGGED_IN,
                    data: { isLoggedIn: false }
                })
            }
        },
    })

    return {logout,loading,error}
}

export default useLogout