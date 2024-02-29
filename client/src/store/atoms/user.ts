import { atom } from "recoil";
import { defaultUserInterface } from "../../../config/types";

export const userAtom = atom({
    key: "userAtom",
    default: null as defaultUserInterface | null
})