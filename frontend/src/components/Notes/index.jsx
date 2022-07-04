import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";
// import { param } from "../../../../backend/routes/auth";

const Notes = () => {

    const [data, setData] = useState({ email: localStorage.getItem("email") });
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [notes, setNotes] = useState([]);
    // const [data, setData] = useState([]);
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location = "/";
        // window.location.reload();
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
            // console.log("params : ", param)
            const urlReg = "http://localhost:8080/api/users/getNotes"
            const { data: res2 } = await axios.get(urlReg, { params });
            console.log("fetched user data status : ", res2.data);
            setNotes(res2.data);


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
            console.log("handleAddNote works! : ", data)
            const url = "http://localhost:8080/api/users/addNote";
            const { data: res } = await axios.post(url, data);
            console.log("res : ", data);
            setMsg(res.message);
            window.location.reload();
            // console.log("res : ", data);

        } catch (error) {
            if (
                error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
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
                <input type="text" name="title" placeholder="Add title" onChange={handleChange} value={data.title} />
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
                        {/* <th>Edit</th> */}
                        <th>Delete</th>
                    </tr>
                </thread>
                <tbody >
                    {notes.map((item) => (
                        <tr>
                            <td>{item.title}</td>
                            <td>{item.description}</td>
                            {/* <td></td> */}
                            <td><button>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    );
};

export default Notes;
