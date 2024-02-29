import { useEffect, useState } from 'react';

export const useDebouncer = (callback: any, delay: number) => {

    const [timer, setTimer] = useState(0);

    useEffect(() => {
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [timer]);

    const debouncedFunction = (...args: any) => {
        if (timer) {
            clearTimeout(timer);
        }
        const newTimer = setTimeout(() => {
            callback(...args);
        }, delay);

        setTimer(newTimer);
    };

    return debouncedFunction;
};