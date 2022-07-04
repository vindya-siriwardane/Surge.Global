import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";

const Notes = () => {
    
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleLogout = () => {
		localStorage.removeItem("token");
        window.location = "/";
		// window.location.reload();
	};

    const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};


    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            console.log("handleAddNote works! : ",data)
            // const url = "http://localhost:8080/api/users/addNote";
            // const { data: res } = await axios.post(url, data);
        // console.log("res1 : ", res);

        } catch (error) {
            if (
                error.response && error.response.status >= 400 && error.response.status <= 500 ) {
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

            <input type="text" placeholder="Add title" onChange={handleChange} value={data.title} />
            <br /><br />
            <textarea name="description" id="description" cols="30" rows="10" placeholder="Insert new note" onChange={handleChange} value={data.description}></textarea>
            <br /><br />
            <button type="submit">Add Note</button>
            </form>
		</div>
	);
};

export default Notes;
