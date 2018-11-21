sap.ui.define(function() {
	"use strict";

	return {

		mapReadingToModel:function(responseData){
			return {
				VehicleID		: responseData.vehicleID,
				ObjectType 		: responseData.docType,
				Reading			: responseData.reading,
				CreationDate	: responseData.creationDate
			};
		},

		mapReadingsToModel:function(responseData){
			
			var items = [];
			if( responseData ){
				for ( var i = 0; i < responseData.length; i++ ){
					items.push(this.mapReadingToModel(responseData[i]));
				}
			}
			return items;
		},

		mapReadingToChaincode:function(oModel, newVehicle){
			
			return this.mapReadingToLocalStorage(oModel, newVehicle);
		},
		
		mapReadingToLocalStorage : function(oModel, newVehicle){
				
			if ( newVehicle === true ) {
				return {
						"vehicleID"		:	this.getNewReadingID(oModel),
						"docType"		:	"Asset.Reading",
						"reading"		:	oModel.getProperty("/newReading/Reading"),
						"creationDate"	:	oModel.getProperty("/newReading/CreationDate")
				};
			} else {
				return {
						"vehicleID"		:	oModel.getProperty("/selectedReading/VehicleID"),
						"docType"		:	"Asset.Reading",
						"reading"		:	oModel.getProperty("/selectedReading/Reading"),
						"creationDate"	:	oModel.getProperty("/selectedReading/CreationDate")
				};				
			}
		},
		
		getNewReadingID:function(oModel){

		    if ( typeof oModel.getProperty("/newReading/VehicleID") === "undefined" ||
		    		oModel.getProperty("/newReading/VehicleID") === ""
		    	){
			    var iD = "KA01 A ";
			    var possible = "0123456789";
			    for( var i = 0; i < 4; i++ ){
			        iD += possible.charAt(Math.floor(Math.random() * possible.length));
			    }
		    } else {
				iD = oModel.getProperty("/newReading/VehicleID");
			}
			oModel.setProperty("/newReading/VehicleID",iD);
		    return iD;
		}
	};
});