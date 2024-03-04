import { atom } from "recoil";
import { Categories, Posts } from "../../../config/types";

export const blogAtom = atom({
    key: 'blogAtom',
    default: [] as Posts[]
})

export const categoriesAtom = atom({
    key: 'categoriesAtom',
    default: [] as Categories[]
})