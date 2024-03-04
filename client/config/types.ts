export interface defaultUserInterface {
    username: string,
    id: string,
    email: string,
    profilePhoto: string
}

export interface completeUserInterface {
    username: string,
    id: string,
    email: string,
    profilePhoto: string,
    createdAt: string
    updatedAt: string
    updated: boolean
}

export interface logoutInterface {
    toLink?: string
}

export interface Posts {
    id: string,
    title: string,
    summary: string,
    content: string,
    cover: string,
    published: boolean,
    authorId: string
    createdAt: string
    updatedAt: string
    updated: boolean
    author: {
        username: string,
        email: string,
        id: string
    }
    category: Categories
}

export interface Categories {
    id: string,
    name: string
}