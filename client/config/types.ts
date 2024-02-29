export interface defaultUserInterface {
    name: string,
    userId: string,
    email: string
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
    published: string,
    authorId: string
}