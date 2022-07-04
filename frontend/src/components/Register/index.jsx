import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";
import React from 'react';
import { BounceLoader } from 'react-spinners';


const Register = () => {

    const [buttonPopup, setButtonPopup] = useState(false)
    const [loadingSpinner, setSpinner] = useState(false)

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: localStorage.getItem("email"),
        dob: null,
        mobile: "",
        type: "student",
        status: true,
    });
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };


    const handleUpdate = async (e) => {
        e.preventDefault();


        try {
            setSpinner(true)
            const url = "http://localhost:8080/api/users/register";
            const { data: res } = await axios.post(url, data);
            setSpinner(false)
            setMsg(res.message);
            setButtonPopup(true);
            window.location = "/login"

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
        <div className={styles.register_container}>

            <div className={styles.register_form_container}>
                <div className={styles.left}>
                    <h1>Welcome</h1>

                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleUpdate}>
                        <h1>Register your infomartion</h1>
                        <input type="text" placeholder='First Name' name="firstName" value={data.firstName} required className={styles.input} onChange={handleChange} />
                        <input type="text" placeholder='Last Name' name="lastName" value={data.lastName} required className={styles.input} onChange={handleChange} />
                        <input type="text" placeholder='Date of Birth' name="dob" value={data.dob} required className={styles.input} onChange={handleChange} />
                        <input type="text" placeholder='Mobile' name="mobile" value={data.mobile} required className={styles.input} onChange={handleChange} />
                        {/* <input type="dro" placeholder='Account Type' name="type" required className={styles.input} /> */}

                        {/* <input type="email" placeholder='Email' name="email" required className={styles.input} /> */}
                        <input type="password" placeholder='Reset Password' name="password" value={data.password} required className={styles.input} onChange={handleChange} />
                        {/* {error && <div className={styles.error_msg}>{error}</div>}
                {msg && <div className={styles.success_msg}>{msg}</div>} */}
                        {error && <div className={styles.error_msg}>{error}</div>}
                        {msg && <div className={styles.success_msg}>{msg}</div>}
                        <BounceLoader loading={loadingSpinner} />

                        <button type='submit' className={styles.green_btn}>Update</button>

                        {/* <Popup trigger={buttonPopup}>
                            <h1>kmkmdkccccccccccccccccccccccccccccccccccccccccccccc</h1>
                        </Popup> */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;