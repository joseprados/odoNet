sap.ui.define([
	"odoNet/util/messageProvider",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(messageProvider, MessageToast,MessageBox){
	"use strict";

	return {
		
		execute:function(chaincode, methodType, data, success){
			
			var method, uRL;
			uRL = chaincode.serviceUrl + chaincode.entity.chaincodeId + chaincode.entity.chaincodeVersion;
			method = _.findWhere(chaincode.entity.methods,{type:methodType});
			
			if (method.path === "/"){
				uRL += method.path;
			} else {
				switch (method.path) {
					case "/{id}":
						uRL += uRL + method.path.replace("{id}",data.vehicleID);
						break;
				}
			}
			if( !success ){ success = function(){}; }
			
			var accessToken = "";
			
			var tokenReq = $.ajax({
				    url: chaincode.serviceKey.tokenUrl + "?grant_type=client_credentials",
				    type: "GET",
				    contentType:"application/json",
				    dataType: "json",
					async:false,
					beforeSend: function(xhr) {
					    xhr.setRequestHeader("Authorization", "Basic " + btoa(chaincode.serviceKey.clientId + ":" + chaincode.serviceKey.clientSecret));
					},					
				    success: function(response){ accessToken = response.access_token; },
				    timeout: 5000
				  });			
			
			var req = $.ajax({
				    url: uRL,
				    type: method.httpMethod,
				    contentType:"application/json",
				    crossDomain: true,
				    // headers:{"authorization": "Bearer " + accessToken },
				    dataType: "json",
				    async:false,
				    data:JSON.stringify(data),
				    beforeSend: function(xhr) { xhr.setRequestHeader("Authorization","Bearer " + accessToken); },
				    success: success,
				    timeout: 5000
				  });
			switch (req.status) {
				case 200:
				    MessageToast.show(method.successMessage);
					messageProvider.addMessage(
						"Success", 
						method.successMessage,
						"API Endpoint : \n" + uRL + "\n" + req.statusText,
						"\n Chaincode ID: \n" + chaincode.entity.chaincodeId + "\n Function Name:" + method.name, 
						1, 
						"", 
						"http://www.sap.com"
					);					
					break;
				case 500:
   			        MessageBox.error(JSON.parse(req.responseText).error.message);
					messageProvider.addMessage(
						"Error", 
						"Internal Server Error",
						"API Endpoint : \n" + uRL + "\n" + req.statusText,
						"\n Chaincode ID: \n" + chaincode.entity.chaincodeId + "\n Function Name:" + method.name, 
						1, 
						"", 
						"http://www.sap.com");
					break;
				default:
					if ( typeof req.responseJSON !== "undefined" ){
						messageProvider.addMessage(
							"Error", 
							req.responseJSON.error.message, 
							"API Endpoint : \n" + uRL + "\n" + req.statusText, 
							"\n Chaincode ID: \n" + chaincode.entity.chaincodeId + "",
							1, 
							"", 
							"http://www.sap.com"
						);
					} else {
						messageProvider.addMessage(
							"Error", 
							"Blockchain Service unreachable!, Check Network Connection", 
							"API Endpoint : \n" + uRL + "\n", 
							"\n Chaincode ID: \n" + chaincode.entity.chaincodeId + "",
							1, 
							"", 
							"http://www.sap.com"
						);
					}
					break;
			}
			return req.status;			
		}
	};
});