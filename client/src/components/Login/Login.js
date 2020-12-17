import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const login =({authenticateUser}) => {
    let History = useHistory();
    const [UserData, setUserData] = useState({
        email:'',
        password:''
    });

    const [errorData, setErrorData] = useState({errors: null});
    const {email, password} = UserData;
    const {errors} = errorData;
    const onChange = e => {
        const {name, value} = e.target;
        setUserData({
            ...UserData, 
            [name]:value
        })
    }

    const loginUser = async() =>{
        const newUser = {
            email:email,
            password:password
        }

        try{
            const config = {
                headers:{
                    'Content-Type': 'application/json'
                }
            }

            const body = JSON.stringify(newUser);
            const res = await axios.post('http://localhost:5000/api/login',body, config);

            //Store user data and redirect
            localStorage.setItem('token', res.data.token);
            History.push('/')

        }catch(error){
            //clear User Data
            localStorage.removeItem('token');
            
            setErrorData({
                ...errors,
                errors: error.response.data.errors
            })
        }

        authenticateUser();
    }

    return(
        <div>
            <h2> Log In</h2>
            <div>
                <input  
                    type = "text"
                    placeholder = "email"
                    name = "email"
                    value = {email}
                    onChange = {e => onChange(e)}/>
            </div>
            <div>
                <button onClick = {() => loginUser()} > Log In</button>
            </div>
            <div>
                {errors && errors.map(error => 
                <div key= {error.msg}>{error.msg}</div>)}
            </div>
        </div>

    )
}

export default login;