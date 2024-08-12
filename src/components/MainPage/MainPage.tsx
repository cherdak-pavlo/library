import "./MainPage.css";
import React, { useContext, useState } from "react";
import { Info } from "../../types/Info";
import { base } from "../../api/base";
import { BookContext } from "../../context/InfoProvider";
import { Loader } from "../Loader";
import classNames from "classnames";

export const MainPage: React.FC = () => {
  const { books, setBooks, loading, setUpdateInfo, setLoading } =
    useContext(BookContext);
  const [loader, setLoader] = useState<string | null>(null);
  const [filterAuthor, setFilterAuthor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "author" | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [InfoIdToDelete, setInfoIdToDelete] = useState<string | null>(null);

  const handleAuthorClick = (personName: Info | null) => {
    setFilterAuthor(personName ? personName.author : null);
  };

  const filteredBooks = filterAuthor
    ? books.filter((book) => book.author === filterAuthor)
    : books;

  const sortedBooks = sortBy
    ? [...filteredBooks].sort((a, b) =>
        a[sortBy]?.localeCompare(b[sortBy] || "")
      )
    : filteredBooks;

  const handleDeleteInfo = (infoId: string | null) => {
    setInfoIdToDelete(infoId);
    setIsConfirmModalOpen(true);
  };

  const deleteInfo = () => {
    if (InfoIdToDelete) {
      setLoader(InfoIdToDelete);
      base("Table 1").destroy(InfoIdToDelete, function (error: any) {
        if (error) {
          console.error(error);
          return;
        }

        setBooks((currentState) =>
          currentState.filter((el) => el.id !== InfoIdToDelete)
        );

        setLoader(null);
        setIsConfirmModalOpen(false);
        setInfoIdToDelete(null);
      });
    } else {
      setIsConfirmModalOpen(false);
      handleDeleteAuthor();
    }
  };

  const handleDeleteAuthor = async () => {
    if (filteredBooks.length === 0) {
      return;
    }

    setLoading(true);

    try {
      await Promise.all(
        filteredBooks.map(
          (book) =>
            new Promise<void>((resolve, reject) =>
              base("Table 1").destroy(book.id, (error: any) => {
                if (error) {
                  console.error(
                    `Error deleting book with ID ${book.id}:`,
                    error
                  );
                  reject(error);
                } else {
                  resolve();
                }
              })
            )
        )
      );

      setBooks((currentState) =>
        currentState.filter((book) => book.author !== filterAuthor)
      );
    } catch (error) {
      console.error("Error deleting books:", error);
    } finally {
      setLoading(false);
      handleAuthorClick(null);
      setLoader(null);
      setIsConfirmModalOpen(false);
      setInfoIdToDelete(null);
    }
  };

  const handleUpdateInfo = (info: Info) => {
    setUpdateInfo(info);
  };

  const handleDownloadJson = () => {
    const jsonBlob = new Blob([JSON.stringify(filteredBooks, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(jsonBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "books.json";

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div data-cy="BooksList" className="table-container">
      <div className="table-title">
        <h1 className="title article-title">
          {filterAuthor ? `${filterAuthor}'s books` : "Books"}
        </h1>

        <div className="select">
          <select
            value={sortBy || ""}
            onChange={(e) => setSortBy(e.target.value as "name" | "author")}
          >
            <option value="">Oldest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="author">Author (A-Z)</option>
          </select>
        </div>

        <div className="download-json">
          <button
            className="button is-link is-light"
            onClick={handleDownloadJson}
          >
            Download
          </button>
        </div>
      </div>
      {isConfirmModalOpen && (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => setIsConfirmModalOpen(false)}
          ></div>
          <div className="modal-content modal-delete-book">
            <div className="box">
              <h1 className="title is-5">
                {InfoIdToDelete
                  ? "Are you sure you want to delete this record?"
                  : "Are you sure you want to delete this author?"}
              </h1>
              <div className="buttons">
                <button className="button is-danger" onClick={deleteInfo}>
                  Yes
                </button>
                <button
                  className="button is-light"
                  onClick={() => setIsConfirmModalOpen(false)}
                >
                  No
                </button>
              </div>
              <button
                className="modal-close is-large"
                aria-label="close"
                onClick={() => setIsConfirmModalOpen(false)}
              ></button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          <table className="table is-striped is-hoverable is-narrow">
            <thead>
              <tr className="has-background-link-light">
                <th>Name</th>
                <th>Author</th>
                <th>Annotation</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedBooks.map((info: Info) => (
                <tr data-cy="Post" key={info.id}>
                  <td data-cy="PostId">{info.name}</td>
                  <td
                    data-cy="PostTitle"
                    onClick={() => handleAuthorClick(info)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {info.author}
                  </td>
                  <td data-cy="PostTitle">{info.annotation}</td>
                  <td data-cy="PostUpdate">
                    <button
                      className={classNames("button is-warning is-small", {
                        "is-light": loader === info.id ? false : true,
                      })}
                      onClick={() => handleUpdateInfo(info)}
                      disabled={loader === info.id}
                    >
                      Update
                    </button>
                  </td>
                  <td data-cy="PostDelete">
                    <button
                      className={classNames("button is-danger is-small", {
                        "is-light": loader === info.id ? false : true,
                      })}
                      onClick={() => handleDeleteInfo(info.id)}
                      disabled={loader === info.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filterAuthor && (
            <div className="buttons">
              <button
                className="button is-link is-light"
                onClick={() => handleAuthorClick(null)}
              >
                View all books
              </button>
              <button
                className="button is-link is-danger"
                onClick={() => handleDeleteInfo(null)}
              >
                Delete author
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
