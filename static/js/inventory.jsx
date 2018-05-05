import React, { Component } from 'react';
import dataFetch from './DataFetch';
import { Button, Table, Modal, Alert } from 'react-bootstrap';
import {Redirect} from 'react-router-dom';


class Inventory extends Component{
	constructor(props){
		super(props);
		this.items = [];
		this.selectedId = -1;
		this.add = 0;
		this.bought = 0;
		this.ids=[];
		this.quantities=[];
		this.keyedList = [];
		this.discounts = [];
		this.gsts = [];
		this.price = 0;
		this.user="";
		this.token="";
		this.isLoggedIn = true;
		this.state={
			isLoadingDone: false,
			listChange: false,
			show: false,
			show2: false,
			quantity: 0,
			discount: 0,
			gst: 0,
			price: 0,
			measurement: "",
			desc: "",
			discrete: true,
			show3: false,
			login: "true"
		};

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
		this.handleChangeDiscount = this.handleChangeDiscount.bind(this);
		this.handleChangeGst = this.handleChangeGst.bind(this);
		this.handleBuy = this.handleBuy.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.fetchData = this.fetchData.bind(this);
		this.handleShow2 = this.handleShow2.bind(this);
		this.handleClose2 = this.handleClose2.bind(this);
		this.handleMeasurement = this.handleMeasurement.bind(this);
		this.handleChecked = this.handleChecked.bind(this);
		this.handleChangeDesc = this.handleChangeDesc.bind(this);
		this.handleChangePrice = this.handleChangePrice.bind(this);
		this.handleNew = this.handleNew.bind(this);
		this.modalInvoice = this.modalInvoice.bind(this);
		this.modalUpdate = this.modalUpdate.bind(this);
		this.modalNew = this.modalNew.bind(this);
		this.handleShow3 = this.handleShow3.bind(this);
		this.handleClose3 = this.handleClose3.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}
	handleShow(id, type){
		this.selectedId = id;
		this.add = type;
		this.setState({
			show: true
		});
		console.log(this.selectedId);
	}
	handleClose(){
		this.selectedId = -1;
		this.setState({
			show:false
		});
	}
	handleClose2(){
		this.setState({
			show2:false
		});
	}
	handleShow2(){
		this.setState({
			show2:true
		});
	}
	handleClose3(){
		this.setState({
			show3:false
		});
	}
	handleShow3(){
		if(this.bought==0)
		{
			alert("No items in cart");
			return;
		}
		this.price = 0;
		var id;
		for (id in this.ids){
			if(this.ids[id]!=null){
				var dp = this.keyedList[this.ids[id]].price - (this.keyedList[this.ids[id]].price)*(this.discounts[this.ids[id]])/100;
				this.price += (this.quantities[this.ids[id]])*(dp + dp*(this.gsts[this.ids[id]])/100);
			}
		}
		this.setState({
			show3:true
		});
	}

	handleChangeQuantity(event){
		this.setState({
			quantity: event.target.value
		});
	}
	handleChangeDiscount(event){
		this.setState({
			discount: event.target.value
		});
	}
	handleChangeGst(event){
		this.setState({
			gst: event.target.value
		});
	}
	handleChangePrice(event){
		this.setState({
			price: event.target.value
		});
	}
	handleChangeDesc(event){
		this.setState({
			desc: event.target.value
		});
	}
	handleMeasurement(event){
		this.setState({
			measurement: event.target.value
		});
	}
	handleChecked(event){
		this.setState({
			discrete: event.target.checked
		});
	}
	handleBuy(){
		if(this.state.quantity<=0){
			alert('Quantity cannot be less than or equal to 0');
			return;
		}else if(this.state.gst<0 || this.state.discount<0){
			alert('Discount or GST cannot be negative');
			return;
		}else if(this.state.quantity>this.keyedList[this.selectedId].quantity){
			alert('Not enough stock available');
			return;
		}
		this.bought+=1;
		this.ids[this.selectedId] = this.selectedId;
		this.discounts[this.selectedId] = this.state.discount;
		this.gsts[this.selectedId] = this.state.gst;
		if(this.quantities[this.selectedId]==null){
			this.quantities[this.selectedId] = this.state.quantity;
		}else{
			this.quantities[this.selectedId]=parseFloat(this.quantities[this.selectedId]) + parseFloat(this.state.quantity);
		}
		this.keyedList[this.selectedId].quantity = parseFloat(this.keyedList[this.selectedId].quantity) - parseFloat(this.state.quantity);
		this.selectedId = -1;
		var change = ! this.state.listChange;
		this.setState({
			show:false,
			quantity: 0,
			discount: 0,
			gst: 0,
			listChange: change
		});
		console.log("Bought");
	}
	handleAdd(){
		if(this.state.quantity<=0){
			alert('Quantity cannot be less than or equal to 0');
			return;
		}
		var quantity = parseFloat(this.keyedList[this.selectedId].quantity) + parseFloat(this.state.quantity);
		dataFetch("http://localhost:5000/add_stock",{'id': this.selectedId, 'quantity': quantity, 'user_name': this.user, 'token': this.token })
			.then(response=>{
				if(response.status=="Success"){
					this.fetchData();
				}
			})
			.catch(err =>{
				console.log(err);
			});
		this.selectedId = -1;
		this.setState({
			show:false,
			quantity: 0
		});
	}
	handleNew(){
		if(this.state.discrete==false && this.state.measurement== ""){
			alert("Please Mention a measurement");
			return;
		}else if(this.state.desc == ""){
			alert("Please Mention a description");
			return;
		}
		var obj = {};
		obj['user_name'] = this.user;
		obj['token'] = this.token;
		obj['desc'] = this.state.desc;
		obj['discrete']  = this.state.discrete;
		obj['measurement']  = this.state.measurement;
		obj['price'] = this.state.price;
		obj['quantity'] = this.state.quantity;
		dataFetch("http://localhost:5000/create_item",obj)
			.then(response =>{
				if(response.status=="Success"){
					this.fetchData();
				}
			})
			.catch(err =>{
				console.log(err);
			});
			this.setState({
				desc: "",
				discrete: true,
				measurement: "",
				price: 0,
				quantity: 0,
				show2: false
			});
	}
	handleConfirm(){
		var result_ids = [];
		var result_quantities = [];
		var id;
		var index = 0;
		for (id in this.ids){
			if(this.ids[id]!=null){
				result_ids[index] = this.ids[id];
				result_quantities[index] = this.quantities[this.ids[id]];
				index+=1;
			}
		}
		var obj = {};
		console.log(result_ids);
		console.log(result_quantities);
		obj['user_name'] = this.user;
		obj['token'] = this.token;
		obj['ids'] = result_ids;
		obj['quantities'] = result_quantities;
		dataFetch("http://localhost:5000/remove_stock",obj)
			.then(response =>{
				if(response.status=="Success"){
					this.fetchData();
				}
			})
			.catch(err =>{
				console.log(err);
			});
		this.price = 0;
		this.ids = [];
		this.quantities = [];
		this.bought = 0;
		this.setState({
			show3:false
		});
	}
	handleRemove(objId){
		console.log(objId);
		this.keyedList[objId].quantity =parseFloat(this.keyedList[objId].quantity) + parseFloat(this.quantities[objId]);
		this.bought-=1;
		this.ids[objId] = null;
		this.quantities[objId] = null;
		this.discounts[objId] = null;
		this.gsts[objId] = null;
		var change = ! this.state.listChange;
		this.setState({
			show3:false,
			listChange: change
		});
	}
	handleLogout(){
		localStorage.clear();
		this.setState({
			login: "false"
		})
	}
	fetchData(){
		dataFetch("http://localhost:5000/all_items",{"user_name": this.user, "token": this.token})
			.then(response =>{
				if(response.status=="Success"){
					this.items = response.message;
					this.items.map(item =>{
						this.keyedList[item.id] = item;
					});
					console.log(this.keyedList);
					this.setState({
						isLoadingDone: true
					});
				}
			})
			.catch(err =>{
				console.log(err)
			});
	}
	componentDidMount(){
		this.user = localStorage.getItem("username");
		this.token = localStorage.getItem("token");
		this.isLoggedIn = localStorage.getItem("isLoggedIn");
		this.setState({
			login: this.isLoggedIn
		})
		this.fetchData();
	}

	modalUpdate(){
		
		if(this.add == 1){
			return(
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>{"Add"}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{"Quantity: "}
						<input id="quantity" type="number" value={this.state.quantity} onChange={this.handleChangeQuantity}/>
						<br/>
						<Button onClick={this.handleAdd}>{"Add"}</Button>
					</Modal.Body>
				</Modal>
				);
		}else{
			return(
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>{"Buy"}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{"Quantity: "}
						<input id="quantity" type="number" value={this.state.quantity} onChange={this.handleChangeQuantity}/>
						<br/>
						{"Discount: "}
						<input id="discount" type="number" value={this.state.discount} onChange={this.handleChangeDiscount}/>
						<br/>
						{"GST: "}
						<input id="gst" type="number" value={this.state.gst} onChange={this.handleChangeGst}/>
						<br/>
						<Button onClick={this.handleBuy}>{"Buy"}</Button>
					</Modal.Body>
				</Modal>
				);
		}
	}

	modalNew(){
		return(
				<Modal show={this.state.show2} onHide={this.handleClose2}>
					<Modal.Header closeButton>
						<Modal.Title>{"Add new Item"}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{"Description: "}
						<input id="description" type="text" value={this.state.desc} onChange={this.handleChangeDesc}/>
						<br/>
						{"Quantity: "}
						<input id="quantity" type="number" value={this.state.quantity} onChange={this.handleChangeQuantity}/>
						<br/>
						{"Price: "}
						<input id="price" type="number" value={this.state.price} onChange={this.handleChangePrice}/>
						<br/>
						<input id="discrete" type = "checkbox" defaultChecked={this.state.discrete} onChange={this.handleChecked}/>{"Discrete"}
						<br/>
						{"Measurement: "}
						<input id="measurement" type="text" value ={this.state.measurement} onChange={this.handleMeasurement}/>
						{"(Not required for discrete items)"}
						<br/>
						<Button onClick={this.handleNew}>{"Add New Item"}</Button>
					</Modal.Body>
				</Modal>
			);
	}

	modalInvoice()
	{
		var sold = this.ids.map((id, i)=>{
			if(id != null){
				if(this.keyedList[id].discrete==true){
					return(
						<tr key={i} id={id}>
						<td>{id}</td>
						<td>{this.keyedList[id].desc}</td>
						<td>{this.quantities[id]}</td>
						<td>{this.keyedList[id].price}</td>
						<td>{this.discounts[id]}</td>
						<td>{this.gsts[id]}</td>
						<td><span onClick={()=>this.handleRemove(id)}><u>{"Remove"}</u></span></td>
						</tr>
						);
				}else{
					return(
						<tr key={i} id={id}>
						<td>{id}</td>
						<td>{this.keyedList[id].desc}</td>
						<td>{this.quantities[id]}</td>
						<td>{this.keyedList[id].price+"/"+this.keyedList[id].measurement}</td>
						<td>{this.discounts[id]}</td>
						<td>{this.gsts[id]}</td>
						<td><span onClick={()=>this.handleRemove(id)}><u>{"Remove"}</u></span></td>
						</tr>
						);
				}
			}
		});
		return(
			<Modal show={this.state.show3} onHide={this.handleClose3}>
					<Modal.Header closeButton>
						<Modal.Title>{"Add new Item"}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Table responsive bordered striped>
							<thead>
								<th>#</th>
								<th>Description</th>
								<th>Quantity</th>
								<th>Price</th>
								<th>Discount</th>
								<th>GST</th>
								<th></th>
							</thead>
							<tbody>
								{sold}
							</tbody>
						</Table>
						<h2>{"Total Price:" + this.price}</h2>
						<br/>
						<Button onClick={this.handleConfirm}>{"Confirm"}</Button>
					</Modal.Body>
				</Modal>
			);
	}

	render(){
		if(this.state.login == "false"){
			return(
				<Redirect to="/"/>
				);
		}
		var items = this.keyedList.map((item, i) =>{
			if(item.discrete == true){
				return(
					<tr key={i} id={item.id}>
					<td>{item.id}</td>
					<td>{item.desc}</td>
					<td> <span onClick={()=>this.handleShow(item.id,1)} style={{marginRight: '30px'}}><u>{"Add"}</u></span><span onClick={()=>this.handleShow(item.id,0)}><u>{"Buy"}</u></span></td>
					<td>{item.quantity}</td>
					<td>{item.price}</td>
					</tr>
					);
			}else{
				return(
					<tr key={i} id={item.id}>
					<td>{item.id}</td>
					<td>{item.desc}</td>
					<td> <span onClick={()=>this.handleShow(item.id,1)} style={{marginRight: '30px'}}><u>{"Add"}</u></span><span onClick={()=>this.handleShow(item.id,0)}><u>{"Buy"}</u></span></td>
					<td>{item.quantity+" "+item.measurement}</td>
					<td>{item.price+ "/"+ item.measurement}</td>
					</tr>
					);
			}

		});

		return(
			<div>
				<h1>Inventory Management System</h1>
				<br/><br/>
				<Table responsive bordered striped>
					<thead>
						<th>#</th>
						<th>Description</th>
						<th></th>
						<th>Available</th>
						<th>Price</th>
					</thead>
					<tbody>
						{items}
					</tbody>
				</Table>
				<Button onClick={this.handleShow2}>{"Add New Item"}</Button>
				<br/>
				<br/>
				<Button onClick={this.handleShow3}>{"Generate Sale Invoice"}</Button>
				<br/>
				<br/>
				<Button onClick={this.handleLogout}>{"Logout"}</Button>
				{this.modalUpdate()}
				{this.modalNew()}
				{this.modalInvoice()}

			</div>
			);
	}
}

export default Inventory;