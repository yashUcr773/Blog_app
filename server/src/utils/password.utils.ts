import { nanoid } from "nanoid";

export function _decodePassword(password: string) {
    password = atob(password);
    const length = password.length;
    password = password.slice(length / 3, 2 * length / 3);
    return password
}

export function _encodePassword(password: string) {
    const length = password.length;
    const prefix = nanoid(length);
    const suffix = nanoid(length);
    return btoa(prefix + password + suffix);
}