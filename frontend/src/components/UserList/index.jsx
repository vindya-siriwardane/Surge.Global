import styles from "../Main/styles.module.css";
import { useState } from "react";
import axios from "axios";

const UserList = () => {
    const [error, setError] = useState("");
    const [data, setData] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location = "/";
    };

    const handlePreview = async (e) => {
        e.preventDefault();
        try {
            let email = localStorage.getItem("email")
            const params = {
                email: email
            };
            console.log("let params : ", params)

            const urlReg = "http://localhost:8080/api/users/getUser"
            const { data: res1 } = await axios.get(urlReg, { params });
            setData(res1.data);
            console.log(data);
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }

    };

    return (
        <div >
            <nav className={styles.navbar}>
                <h1>User List</h1>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            {error && <div className={styles.error_msg}>{error}</div>}
            <button onClick={handlePreview} className={styles.green_btn}>Preview User Data</button>
            <table className={styles.userTable}>
                <thread >
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mobile</th>
                        <th>Birtdate</th>
                    </tr>
                </thread>
                <tbody >
                    {data.map((item) => (
                        <tr>
                            <td>{item.firstName}</td>
                            <td>{item.lastName}</td>
                            <td>{item.mobile}</td>
                            <td>{item.dob}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
