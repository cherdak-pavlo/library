import "./AddEditInfo.css";
import React, { useContext, useEffect, useState } from "react";
import { Info } from "../../types/Info";
import { base } from "../../api/base";
import { BookContext } from "../../context/InfoProvider";
import classNames from "classnames";

export const AddEditInfo: React.FC = () => {
  const { books, setBooks, updateInfo, setUpdateInfo } =
    useContext(BookContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createAuthor, setCreateAuthor] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [newPerson, setNewInfo] = useState({
    name: "",
    author: "",
    annotation: "",
  });

  const [error, setError] = useState({
    name: false,
    author: false,
    annotation: false,
  });

  const uniqueAuthors = books.reduce<Info[]>((acc, book) => {
    if (
      book.author.trim() &&
      !acc.some((item) => item.author === book.author)
    ) {
      acc.push(book);
    }
    return acc;
  }, []);

  useEffect(() => {
    if (updateInfo) {
      setNewInfo({
        name: updateInfo.name,
        author: updateInfo.author,
        annotation: updateInfo.annotation,
      });

      setIsModalOpen(true);
    }
  }, [updateInfo]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUpdateInfo(null);
    setCreateAuthor(false);
    setError({
      name: false,
      author: false,
      annotation: false,
    });
    setNewInfo({
      name: "",
      author: "",
      annotation: "",
    });
  };

  const handleCustomAuthorInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewInfo((currentState) => ({
      ...currentState,
      author: event.target.value,
    }));
  };

  const handleInput = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    if (name === "author") {
      if (value === "custom") {
        setCreateAuthor(true);
        setNewInfo((currentState) => ({ ...currentState, [name]: "" }));
      } else {
        setCreateAuthor(false);
        setNewInfo((currentState) => ({ ...currentState, [name]: value }));
      }
    } else {
      setNewInfo((currentState) => ({ ...currentState, [name]: value }));
    }

    setError((currentState) => ({ ...currentState, [name]: false }));
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPerson.name || !newPerson.author || !newPerson.annotation) {
      setError({
        name: !newPerson.name,
        author: !newPerson.author,
        annotation: !newPerson.annotation,
      });

      return;
    }

    setIsLoading(true);

    if (updateInfo) {
      const newInfo = {
        Name: newPerson.name,
        Author: newPerson.author,
        Annotation: newPerson.annotation,
      };

      base("Table 1").update(updateInfo.id, newInfo, function (error: any) {
        if (error) {
          console.error(error);
          return;
        }
        setBooks((currentState) =>
          currentState.map((el) =>
            el.id === updateInfo.id ? { ...updateInfo, ...newPerson } : el
          )
        );
      });

      setUpdateInfo(null);
    } else {
      base("Table 1").create(
        {
          Name: newPerson.name,
          Author: newPerson.author,
          Annotation: newPerson.annotation,
        },
        function (err: any, record) {
          if (err) {
            console.error(err);
            return;
          }

          if (record) {
            const personInfo: Info = {
              id: String(record.id),
              name: String(record.fields.Name),
              author: String(record.fields.Author),
              annotation: String(record.fields.Annotation),
            };

            setBooks((currentState) => [...currentState, personInfo]);
          }
        }
      );
    }

    setNewInfo({ name: "", author: "", annotation: "" });
    setIsLoading(false);
    setCreateAuthor(false);
    handleCloseModal();

    if (updateInfo) {
      setUpdateInfo(null);
    }
  };

  return (
    <>
      <div className="new-book-wrapper">
        <button
          className="button is-light"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Book
        </button>
      </div>

      <div className={classNames("modal", { "is-active": isModalOpen })}>
        <div className="modal-background" onClick={handleCloseModal}></div>
        <div className="modal-content">
          <h1 className="title" style={{ color: "white", cursor: "default" }}>
            {updateInfo ? "Update Record" : "New Record"}
          </h1>
          <div className="box">
            <button
              className="delete is-large"
              aria-label="close"
              onClick={handleCloseModal}
              style={{ position: "absolute", top: "10px", right: "10px" }}
            ></button>
            <form
              data-cy="NewannotationForm"
              style={{ maxWidth: "400px" }}
              className="container"
              onSubmit={(e) => handleSubmitForm(e)}
            >
              <div className="field" data-cy="NameField">
                <label className="label" htmlFor="annotation-author-name">
                  Name
                </label>
                <div className="control has-icons-right">
                  <input
                    type="text"
                    name="name"
                    id="annotation-author-name"
                    placeholder="Book name"
                    className={classNames("input", { "is-danger": error.name })}
                    value={newPerson.name}
                    onChange={(e) => handleInput(e)}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-user" />
                  </span>
                  <span
                    className="icon is-small is-right has-text-danger"
                    data-cy="ErrorIcon"
                  >
                    <i className="fas fa-exclamation-triangle" />
                  </span>
                </div>

                {error.name && (
                  <p className="help is-danger" data-cy="ErrorMessage">
                    Name is required
                  </p>
                )}
              </div>
              <div className="field" data-cy="authorField">
                <label className="label" htmlFor="annotation-author">
                  Author
                </label>
                <div className="control">
                  {!createAuthor ? (
                    <div className="select is-fullwidth">
                      <select
                        name="author"
                        id="annotation-author"
                        className={classNames({ "is-danger": error.author })}
                        value={newPerson.author}
                        onChange={handleInput}
                      >
                        <option value="">Select an author</option>
                        {uniqueAuthors.map((el: Info) => (
                          <option key={el.author} value={el.author}>
                            {el.author}
                          </option>
                        ))}
                        <option value="custom">Or type your own...</option>
                      </select>
                    </div>
                  ) : (
                    <input
                      type="text"
                      name="customAuthor"
                      id="custom-author-input"
                      placeholder="Type your own author"
                      className={classNames("input", {
                        "is-danger": error.author,
                      })}
                      value={newPerson.author}
                      onChange={handleCustomAuthorInput}
                    />
                  )}
                </div>
                {error.author && (
                  <p className="help is-danger" data-cy="ErrorMessage">
                    Author is required
                  </p>
                )}
              </div>
              <div className="field" data-cy="BodyField">
                <label className="label" htmlFor="annotation-body">
                  Annotation
                </label>
                <div className="control">
                  <textarea
                    id="annotation-body"
                    name="annotation"
                    placeholder="Type annotation here"
                    className={classNames("input", {
                      "is-danger": error.annotation,
                    })}
                    value={newPerson.annotation}
                    onChange={(e) => handleInput(e)}
                  />
                </div>

                {error.annotation && (
                  <p className="help is-danger" data-cy="ErrorMessage">
                    Enter some text
                  </p>
                )}
              </div>
              <div className="field is-grouped" style={{ marginTop: "20px" }}>
                <div className="control">
                  <button
                    style={{ width: "80px" }}
                    type="submit"
                    className="button is-link"
                    disabled={isLoading}
                  >
                    {updateInfo ? "Update" : "Save"}
                  </button>
                </div>
                <div className="control">
                  <button
                    style={{ width: "80px" }}
                    type="reset"
                    className="button is-link is-light"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
