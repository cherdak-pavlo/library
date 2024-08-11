import React, { createContext, useEffect, useState } from "react";
import { Info } from "../types/Info";
import { base } from "../api/base";

type BookContextType = {
  books: Info[];
  setBooks: React.Dispatch<React.SetStateAction<Info[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateInfo: Info | null;
  setUpdateInfo: React.Dispatch<React.SetStateAction<Info | null>>;
};

export const BookContext = createContext<BookContextType>({
  books: [],
  setBooks: () => {},
  loading: false,
  setLoading: () => {},
  updateInfo: null,
  setUpdateInfo: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const InfoProvider: React.FC<Props> = ({ children }) => {
  const [books, setBooks] = useState<Info[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateInfo, setUpdateInfo] = useState<Info | null>(null);

  useEffect(() => {
    setLoading(true);

    base("Table 1")
      .select({ view: "Grid view" })
      .eachPage((records) => {
        const peopleInfo = records.map((record) => ({
          id: String(record.id),
          name: String(record.fields.Name),
          author: String(record.fields.Author),
          annotation: String(record.fields.Annotation),
        }));

        setBooks(peopleInfo);
        setLoading(false);
      });
  }, []);

  return (
    <BookContext.Provider
      value={{
        books,
        setBooks,
        loading,
        setLoading,
        updateInfo,
        setUpdateInfo,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
