import React, { useState, useRef } from 'react';
import "./index.css"
import { Jumbotron, Button, Container, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios';
import useReactRouter from "use-react-router"
import {Link} from "react-router-dom"

// axios.defaults.baseURL = '/api';

interface LoginProps {
    func: string;
  }

const Login: React.SFC<LoginProps> = (props) => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const {history, location, match} = useReactRouter();

    const loginRequest = () => {
        let storage = window.localStorage;
        axios.request({
            url:"/entry/login",
            method:"post",
            data:{
                username: name,
                password: password,
            },
        }).then(res=>{
            let page :string = res.data;
            console.log('post', page);
            if(page=="/homepage"){
                storage.username = name;
            }
            history.push(page);
            // createBrowserHistory().push("#"+res.data);
        });
    };

    const toRegister = () => {
    };

    return (
        <div>

        <Jumbotron fluid>
            <Container fluid>
            <h1 className="display-3">ITrader UI</h1>
                <p className="lead">Mock Trading System built with Spring Boot & React</p>
                <hr className="my-2" />
            </Container>
        </Jumbotron>

        <div className="login-content">
            <Form>
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input type="text" name="username" value={name} onChange={e=>setName(e.target.value)} placeholder="Please enter your username" required />
                    <FormText color="muted">
                    </FormText>
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" onChange={e=>setPassword(e.target.value)} placeholder="Please enter your password" required />
                </FormGroup>
                <div className='func-btn'>
                    <Button onClick={loginRequest}>{props.func}</Button>
                    <Button >
                        <Link to="/register">Sign up</Link>
                    </Button>
                </div>
            </Form>
        </div>

        </div>
    );
};

export default Login;