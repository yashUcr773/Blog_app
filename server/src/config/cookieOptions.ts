interface TokenCookieOptions {
    domain?: string
    expires?: Date
    httpOnly: boolean
    maxAge: number
    path?: string
    secure: boolean
    sameSite: 'Strict' | 'Lax' | 'None'
}

export const tokenCookieOptions: TokenCookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: 'None',
};

