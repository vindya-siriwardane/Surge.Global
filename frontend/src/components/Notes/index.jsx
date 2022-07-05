import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from '@material-ui/lab/Pagination';
import ReactPaginate from 'react-paginate';

const Notes = () => {

    const [data, setData] = useState({ email: localStorage.getItem("email") });
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [notes, setNotes] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;
    const [trigger, setTrigger] = useState(0)

    useEffect(() => {
        setTrigger(101);
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(notes.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(notes.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % notes.length;

        setItemOffset(newOffset);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location = "/";
    };

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleGetNote = async (e) => {
        e.preventDefault();
        try {
            let emails = localStorage.getItem("email");
            const params = {
                email: emails
            };
            const urlReg = "http://localhost:8080/api/users/getNotes"
            const { data: res2 } = await axios.get(urlReg, { params });
            setCurrentItems(res2.data);
            setNotes(res2.data)
            setTrigger(trigger + 1);

        } catch (error) {
            if (
                error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/users/addNote";
            const { data: res } = await axios.post(url, data);
            setMsg(res.message);
            window.location.reload();

        } catch (error) {
            if (
                error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };

    const handleDeleteNote = async (event, param) => {
        try {
            const url = `http://localhost:8080/api/users/deleteNote/${param}`;
            const { data } = await axios.delete(url);
            setMsg(data.message)
            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    };

    const handleEditNote = async (event, param) => {
        try {
            const url = `http://localhost:8080/api/users/getNote/${param}`;
            const { data: resGet } = await axios.get(url, { param: param });
            setData(resGet.data)

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div >
            <nav className={styles.navbar}>
                <h1>My Notes</h1>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            <form onSubmit={handleAddNote}>
                <button onClick={handleGetNote}>Load All Notes</button>
                <br /><br />
                <input type="text" name="title" placeholder="Add Title" onChange={handleChange} value={data.title} />
                <br /><br />
                <textarea name="description" id="description" cols="30" rows="10" placeholder="Insert new note" onChange={handleChange} value={data.description}></textarea>
                <br /><br />
                {msg && <div className={styles.success_msg}>{msg}</div>}
                {error && <div className={styles.error_msg}>{error}</div>}
                <button type="submit">Add Note</button>
            </form>
            <table className={styles.userTable}>
                <thread >
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thread>
                <tbody >
                    {currentItems.map((item) => (
                        <tr>
                            <td>{item.title}</td>
                            <td>{item.description}</td>
                            <td><button onClick={event => handleEditNote(event, item._id)}>Edit</button></td>
                            <td><button onClick={event => handleDeleteNote(event, item._id)}>Delete</button></td>
                        </tr>
                    ))}
                    <Pagination count={notes.length} />

                </tbody>
            </table>

            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
            />


        </div>
    );
};

export default Notes;
