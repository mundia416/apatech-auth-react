
export const isDev = process.env.NODE_ENV === 'development'

let fullUrl = isDev ? window.location.href.replace('http://', '') :  window.location.href.replace('https://', '')

fullUrl = fullUrl.replace("www.",'')

export const BASE_URL = isDev ? fullUrl.slice(0,fullUrl.indexOf('/'))
    :  fullUrl.slice(0,fullUrl.indexOf('/'))

    
export const HTTP = isDev ? `http://` : `https://`
export const HTTP_URL = `${HTTP}${BASE_URL}`
