interface TokenCookieOptions {
    domain?: string
    expires?: Date
    httpOnly: boolean
    maxAge: number
    path?: string
    secure: boolean
    sameSite: 'Strict' | 'Lax' | 'None'
}

export const getTokenCookieOptions = (env?: string): TokenCookieOptions => {
    const isDevelopment = env === 'development'

    return {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60,
        secure: !isDevelopment,
        sameSite: isDevelopment ? 'Lax' : 'None',
    };
}
