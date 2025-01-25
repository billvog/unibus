import { atom } from "jotai";

type SearchAtom = {
  open: boolean;
};

export const searchAtom = atom<SearchAtom>({ open: false });
