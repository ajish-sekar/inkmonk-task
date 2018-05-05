import 'whatwg-fetch';

export default function dataFetch(url,params) {
	var formBody = [];
	for (var property in params) {
	  var encodedKey = encodeURIComponent(property);
	  var encodedValue = encodeURIComponent(params[property]);
	  if(Array.isArray(params[property])){
	  	for(var i in params[property]){
	  		var value = encodeURIComponent(params[property][i]);
	  		formBody.push(encodedKey + "=" + value);
	  	}
	  }else{
	  	formBody.push(encodedKey + "=" + encodedValue);
	  }
	}
	formBody = formBody.join("&");
	const apiConfig = {
		method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		credentials: 'same-origin',
		body: formBody
	};

	return fetch(url,apiConfig)
		.then(function(response){
			if(response.ok) {
				return response.json().then((json) => {
					return json; //Gets cascaded to the next then block
				});
			} else {
				console.error(`Response status ${response.status} during dataFetch for url ${response.url}.`);
				throw new Error(response);
			}
		})	
		.catch(function(error){
			throw error; //gets caught in the higher catch block
		});
}