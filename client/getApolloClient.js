import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloLink } from '@apollo/client';
import { getToken } from './utils/authUtil';


const getApolloClient = ({ port, productionServerUrl }) => {
    const httpLink = createUploadLink({
        uri: (process.env.NODE_ENV === 'development') ? `http://localhost:${port}/graphql` : productionServerUrl,

    })

    const authLink = new ApolloLink((operation, forward) => {
        const token = getToken();
        operation.setContext({
            headers: {
                "Access-Control-Allow-Origin": '*',
                authorization: token
            }
        })
        return forward(operation)
    })

    const apolloClient = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    })

    return apolloClient
}

export default getApolloClient