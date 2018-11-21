sap.ui.define(function() {
	"use strict";
	
	jQuery.sap.require("jquery.sap.storage");
	var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
	var readingsDataID = "readings";
	
	return {
		
		init: function(){

			oStorage.put(readingsDataID,[]);
			oStorage.put(
				readingsDataID, 	
				[
					{
						"vehicleID"   : "KA01 A 1234",
						"docType"     : "Asset.Reading",
						"reading"     : "51000",
						"creationDate": "02/02/2018"
					},
					{
						"vehicleID"   : "KA02 B 4567",
						"docType"     : "Asset.Reading",
						"reading"     : "128000",
						"creationDate": "02/08/2018"
					}
				]
			);
		},
		
		getReadingDataID : function(){
			
			return readingsDataID;
		},
		
		getReadingData  : function(){
			
			return oStorage.get("readings");
		},
		
		put: function(newReading){
			
			var readingsData = this.getReadingData();
			readingsData.push(newReading);
			oStorage.put(readingsDataID, readingsData);
		},
		
		remove : function (id){
		
			var readingsData = this.getReadingData();
			readingsData = _.without(readingsData,_.findWhere(readingsData,{vehicleID:id}));
			oStorage.put(readingsDataID, readingsData);
		},
		
		update : function(updatedReading){
			
			var readingsData = this.getReadingData();
			var reading = _.findWhere(readingsData, {vehicleID:updatedReading.vehicleID});
			
			var currReading = parseFloat(reading.reading);
			var newReading = parseFloat(updatedReading.reading);
			var currDate = new Date(reading.creationdate);
			var newDate = new Date(updatedReading.creationDate);
			
			if ( currReading < newReading ) { 
				reading.reading = updatedReading.reading;
			} else { 
				sap.m.MessageToast.show("Error! New Reading is less than Existing Reading"); 
			}
			if ( +currDate < +newDate ) { 
				reading.creationDate = updatedReading.creationDate;
			} else {
				sap.m.MessageToast.show("Error! New Date is earlier than old Date");
			}
			this.remove(updatedReading.vehicleID);
			this.put(reading);
			sap.m.MessageToast.show("Success! Reading updated successfully!");
		},
		
		removeAll : function(){
		
			oStorage.put(readingsDataID,[]);	
		},
		
		clearReadingData: function(){
			
			oStorage.put(readingsDataID,[]);
		}
	};
});