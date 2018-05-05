import React, { Component } from 'react';
import dataFetch from './DataFetch';
import {Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';

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

class Register extends Component{
	constructor(props){
		super(props);
		this.state={
			login: false,
			name: "",
			pwd: "",
			cnf: ""
		}
		this.handleName=this.handleName.bind(this);
		this.handlePwd=this.handlePwd.bind(this);
		this.handleCnf=this.handleCnf.bind(this);
		this.handleRegister=this.handleRegister.bind(this);
	}

	handleName(event){
		this.setState({
			name: event.target.value
		});
	}

	handlePwd(event){
		this.setState({
			pwd: event.target.value
		});
	}
	handleCnf(event){
		this.setState({
			cnf: event.target.value
		});
	}
	handleRegister(){
		if(this.state.name=="" || this.state.pwd==""|| this.state.cnf==""){
			alert("Do not leave fields empty");
			return;
		}else if(this.state.cnf!=this.state.pwd){
			alert("Passwords do not match");
			return;
		}
		dataFetch("http://localhost:5000/register",{"user_name": this.state.name, "password": this.state.pwd})
			.then(response=>{
				if(response.status=="Success"){
					this.setState({
						login:true
					})
				}
			})
			.catch(err=>{
				alert("Try a different Username");
				console.log(err);
			});
	}

	render(){
		if(this.state.login){
			return(
				<Redirect to="/"/>
				);
		}
		return(
			<div style={style.login}>
				<h4>Register</h4>
				{"Username: "}
				<input id="username" type="text" value={this.state.name} onChange={this.handleName}/>
				<br/>
				<br/>
				{"Password: "}
				<input id="pwd" type="password" value={this.state.pwd} onChange={this.handlePwd}/>
				<br/>
				<br/>
				{"Confirm Password: "}
				<input id="cnf_pwd" type="password" value={this.state.cnf} onChange={this.handleCnf}/>
				<br/>
				<br/>
				<Button onClick={this.handleRegister} style={{marginLeft: '5vw'}}>Register</Button>
			</div>
			);
	}

}

export default Register;