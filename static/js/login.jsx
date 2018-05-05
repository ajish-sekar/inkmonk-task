import React, { Component } from 'react';
import dataFetch from './DataFetch';
import {Button} from 'react-bootstrap';
import {Link, Redirect} from 'react-router-dom';

var style={
	login: {
		borderRadius: '2vh',
		border: "1vh solid #0d47a1",
		padding: '5vh',
		marginTop: '5vh',
		marginLeft: '35vw',
		width: '20vw'

	}
};
class Login extends Component{
	constructor(props){
		super(props);
		this.state={
			userName: "",
			password: "",
			dashBoard: false
		};
		this.handleName = this.handleName.bind(this);
		this.handlePwd = this.handlePwd.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleName(event){
		this.setState({
			userName: event.target.value
		});
	}

	handlePwd(event){
		this.setState({
			password: event.target.value
		});
	}

	handleLogin(){
		if(this.state.userName==""){
			alert("Please Do not leave the username empty");
			return;
		}else if(this.state.password==""){
			alert("Please Do not leave the password empty");
			return;
		}
		dataFetch("http://localhost:5000/login",{"user_name": this.state.userName, "password": this.state.password})
			.then(response =>{
				if(response.status=="Success"){
					localStorage.setItem("token", response.message.user_token);
					localStorage.setItem("username", response.message.username);
					localStorage.setItem("isLoggedIn", true);
					this.setState({
						dashBoard: true
					})
				}else{
					alert(response.message);
				}
			})
			.catch(err =>{
				alert("An error has occured, Please Try Again Later");
				console.log(err);
			});
	}

	render(){
		if(this.state.dashBoard){
			return(
				<Redirect to="/dashBoard"/>
				);
		}
		return(
			<div style={style.login}>
				<h4>Login</h4>
				{"Username: "}
				<input id="username" type="text" value={this.state.userName} onChange={this.handleName}/>
				<br/>
				<br/>
				{"Password: "}
				<input id="pwd" type="password" value={this.state.password} onChange={this.handlePwd}/>
				<br/>
				<br/>
				<Button onClick={this.handleLogin} style={{marginLeft: '5vw'}}>Login</Button>
				<br/>
				<br/>
				<Link to={"/registration"} style={{marginLeft: '5vw'}}>Register</Link>
			</div>
			);
	}

}

export default Login;