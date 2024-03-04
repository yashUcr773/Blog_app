interface ProfilePhotoInterface {
    src?: string,
    alt?: string,
    size?: number
}

export function ProfilePhoto({ src, alt, size = 16 }: ProfilePhotoInterface) {


    if (src) {
        return <img className="mr-4 w-24 h-24 rounded-full" src={src} alt={alt} />
    }


    return (
        <div className={`pointer-events-none relative w-${size} h-${size} overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
            <svg className={`absolute w-${size} h-${size} text-gray-400 -left-0 top-2`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
        </div>
    )
}