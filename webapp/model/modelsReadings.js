sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";

	return {

		createReadingsModel: function(){
			
			var oModel = new JSONModel();
			oModel.setDefaultBindingMode("TwoWay");
			oModel.setData({
				chaincode:{
					serviceUrl:"",
					serviceKey:{},
					entity:{}					
				},
				readingCollection	: {
					cols:[
						{name:"VehicleID"},
						{name:"ObjectType"},
						{name:"Reading"},
						{name:"CreationDate"}
					],
					items:[]
				},
				selectedReading	: {},		
				newReading		: {
					VehicleID		: "",
					ObjectType		: "",
					Reading			: "",
					CreationDate	: ""
				},
				selectedReadingID	: "",
				searchReadingID : ""
			});
			return oModel;			
		}
	};
});