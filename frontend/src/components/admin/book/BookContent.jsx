import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Loading from "../../moleculs/spinner/Spinner";
import SearchMenu from "../SearchMenu";
import style from "../user/styles.css";
import ToggleMenu from "../ToggleMenu";
import Pagination from "../user/Pagination";
import {
  deleteBook,
  fetchBooks,
} from "../../../redux/admin/book/adminBookAction";

const BookContent = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { books, isLoading } = useSelector((state) => state.adminBook);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [bookTitle, setBookTitle] = useState("");
  const [bookID, setBookID] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  var currentBooks = [];

  useEffect(() => {
    dispatch(fetchBooks());
  }, []);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  if (books.data) {
    currentBooks = books.data.slice(indexOfFirstUser, indexOfLastUser);
  }

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-3" id="page-content-wrapper">
          <div className="d-flex justify-content-between">
            <ToggleMenu />
            <SearchMenu />
          </div>
          <h3 className="mt-1">Books</h3>
          <div className="container-fluid d-flex justify-content-end">
            <Button href="/admin/books/add" className="mb-2">
              Add Book
            </Button>
          </div>
          <div className="container-fluid">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>File</th>
                  <th>Video</th>
                  <th>Category ID</th>
                  <th colSpan="2" className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBooks &&
                  currentBooks.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {usersPerPage * currentPage == 5
                            ? index + 1
                            : currentPage + index + usersPerPage - 1}
                        </td>
                        <td>{data.title}</td>
                        <td>{data.url_file}</td>
                        <td>{data.url_video}</td>
                        <td>{data.category_id}</td>

                        <td>
                          <Button href={"/admin/books/edit/" + data.id}>
                            Update
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => {
                              setShow(true);
                              setBookID(data.id);
                              setBookTitle(data.title);
                            }}
                          >
                            Delete
                          </Button>
                          <Modal
                            show={show}
                            onHide={handleClose}
                            className="mt-5"
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>
                                Are you sure to delete {bookTitle} ?
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Button
                                variant="danger"
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(deleteBook(bookID, history));
                                  handleClose();
                                }}
                              >
                                Yes
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end">
              <Pagination
                usersPerPage={usersPerPage}
                totalUsers={books.data ? books.data.length : 0}
                paginate={paginate}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookContent;
