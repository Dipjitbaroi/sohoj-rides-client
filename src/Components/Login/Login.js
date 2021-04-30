
import React, { useContext, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';

import Header from '../Header/Header';
import './Login.css'
import { configFunction, createUserByEmail, emailSignIn, googleLogin } from './LoginManager';
configFunction()
const Login = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',

    });
    const [newUser, setNewUser] = useState(false)
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);

    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    console.log(location);

    const emailAndPassChecker = (e) => {
        let isValid;
        if (e.target.name === 'email') {
            const validEmailExpressions = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const emailValid = validEmailExpressions.test(e.target.value)
            isValid = emailValid;
        }
        if (e.target.name === 'password') {
            const validPassExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

            const passValid = validPassExpression.test(e.target.value)
            if (passValid) {
                user.password = e.target.value;
            }
            isValid = passValid;
        }
        if (newUser && e.target.name === 'confirmPass') {
            if (e.target.value === user.password) {
                isValid = true
            }
            else {
                const userInfo = { ...user };
                userInfo.passNotMatch = true
                setUser(userInfo)
            }
        }
        if (e.target.name === 'name') {
            user.name = e.target.value
        }
        if (isValid) {
            const userInfo = { ...user };
            userInfo[e.target.name] = e.target.value;
            setUser(userInfo)
        }

    }

    const loginAndCreateAC = (e) => {
        if (newUser && user.email && user.confirmPass) {
            createUserByEmail(user.name, user.email, user.password)
                .then(res => {
                    setLoggedInUser(res)
                    setUser(res);
                    if (res.isSignIn) {
                        history.replace(from)
                    }
                })
        }
        if (!newUser && user.email && user.password) {
            emailSignIn(user.email, user.password)
                .then(res => {
                    setLoggedInUser(res)
                    setUser(res)

                    if (res.isSignIn) {
                        history.replace(from)
                    }
                })
        }
        e.preventDefault()
    }

    const loginByGoogle = () => {
        googleLogin()
            .then(res => {
                setLoggedInUser(res)
                setUser(res)

                if (res.isSignIn) {
                    history.replace(from)
                }
            })
    }
    return (
        <Container>
            <Header></Header>
            <div className='formBody'>
                <Form className='form'>
                    <Form.Group><h3>{newUser ? 'Create account' : 'Login'}</h3></Form.Group>


                    {newUser && <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" name='name' onChange={emailAndPassChecker} required />
                    </Form.Group>}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name='email' onChange={emailAndPassChecker} placeholder="Enter email" required />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name='password' placeholder="Password" onChange={emailAndPassChecker} required />
                        {newUser && <Form.Text className="text-muted">
                            At least one number and one spacial character(!,@,#,$,%,^,*) need in your password
                                </Form.Text>}
                    </Form.Group>
                    {newUser && <Form.Group controlId="formBasicPassword">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control type="password" name='confirmPass' placeholder="Confirm password" onChange={emailAndPassChecker} required />
                    </Form.Group>}

                    <p style={{ color: 'red' }}>
                        {user.error}
                    </p>

                    <Button variant="primary" type="submit" onClick={loginAndCreateAC} block>
                        {newUser ? 'Create account' : 'Login'}
                    </Button>

                    <br />

                    <Form.Group controlId="formBasicCheckbox" style={{ fontSize: 'large',color:'blue'}}>
                        <Form.Check onChange={() => setNewUser(!newUser)} type="checkbox" label="Check me out if you are a new user" />
                    </Form.Group>

                    <Button variant="success" onClick={loginByGoogle}>Login with Google</Button>
                    
                </Form>
            </div>
        </Container>
    );
};

export default Login;