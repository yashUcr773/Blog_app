import { createPortal } from "react-dom"


export function Loader({ fullPage = false, size = 'sm' }) {

    const root: any = document.querySelector('#root')
    if (fullPage) {
        return createPortal(
            <div className="fixed z-50 w-full h-full top-0 left-0 flex flex-row items-center justify-center bg-gray-300 opacity-50">
                <div className="inline-block h-32 w-32 animate-spin rounded-full border-8 border-solid border-current 
                    border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] opacity-1"
                    role="status">
                    <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap 
                        !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span>
                </div>
            </div>,
            root)
    } else {

        let border = ""
        switch (size) {
            case 'xs': border += "w-4 h-4 border-2"; break
            case 'sm': border += "w-6 h-6 border-2"; break
            case 'md': border += "w-8 h-8 border-4"; break
            case 'lg': border += "w-12 h-12 border-4"; break
            case 'xl': border += "w-16 h-16 border-4"; break
            default: border += "w-4 h-4 border-2"; break
        }

        return <div
            className={`inline-block animate-spin rounded-full border-solid border-current 
            border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${border}`}
            role="status">
            <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap 
                !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
        </div>
    }
}