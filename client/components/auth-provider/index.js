import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ApolloProvider } from '@apollo/react-hooks'
import getApolloClient from './getApolloClient'

function AuthProvider({ children, port, productionServerUrl }) {
    const [apolloClient, setApolloClient] = useState()

    useEffect(() => {

        setApolloClient(getApolloClient({ port, productionServerUrl }))
    }, [])

    return (
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider>
    )
}

AuthProvider.defaultProps = {
    port: 4000
}

AuthProvider.propTypes = {
    port: PropTypes.number,
    productionServerUrl: PropTypes.string
}

export default AuthProvider

