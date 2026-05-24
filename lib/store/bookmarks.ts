import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Bookmark = {
  id: string;
  date: string; // YYYY-MM-DD（lib/date.ts の getTodayLocalDate() で生成）
  message: string;
};

type BookmarksState = {
  bookmarks: Bookmark[];
  add: (input: Omit<Bookmark, "id">) => void;
};

// version は PR-6 で Bookmark.photoUri を追加する時に 2 へ上げ、persist の migrate でスキーマを移行する想定。
export const useBookmarks = create<BookmarksState>()(
  persist(
    (set) => ({
      bookmarks: [],
      add: (input) =>
        set((state) => ({
          bookmarks: [
            { ...input, id: Date.now().toString() },
            ...state.bookmarks,
          ],
        })),
    }),
    {
      name: "bookmarks-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
