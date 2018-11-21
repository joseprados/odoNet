sap.ui.define([
	"odoNet/controller/BaseController",
	"odoNet/util/localStoreReadings",
	"odoNet/util/bizNetAccessReadings"
], function(
		BaseController, 
		localStoreReadings, 
		bizNetAccessReadings
	) {
	"use strict";
	
	return BaseController.extend("odoNet.controller.ReadingDetails", {
		
		onInit : function(){
		
			this.getOwnerComponent().getRouter().getRoute("reading").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched : function (oEvent) {
			
			this.getOwnerComponent().getModel("Readings").setProperty("/selectedReading",{});
			var pId = oEvent.getParameter("arguments").readingId;
			if ( pId === "___new" ) {
				this.getView().byId("__barReading").setSelectedKey("New");
			} else {
				bizNetAccessReadings.loadReading(this.getView().getModel("Readings"), oEvent.getParameter("arguments").readingId);
			}
		},
		
		addNew : function(){
			
			var oModel = this.getView().getModel("Readings");
			if ( 
				 oModel.getProperty("/newReading/Reading") 		!== "" ||
				 oModel.getProperty("/newReading/CreationDate")	!== "" 
				) {
				var readingId = bizNetAccessReadings.addNewReading(this.getOwnerComponent(), oModel);
				this.getView().byId("__barReading").setSelectedKey("Details");
				bizNetAccessReadings.loadReading(this.getView().getModel("Readings"), readingId);
			} else {
				sap.m.MessageToast.show("Please enter valid data in all fields", {});
			}
			this._clearNewAsset();
		},
		
		update : function(){
			
			var oModel = this.getView().getModel("Readings");
			if ( 
				 oModel.getProperty("/selectedReading/Reading") 		!== "" ||
				 oModel.getProperty("/selectedReading/CreationDate")	!== ""
				) {
				var readingId = bizNetAccessReadings.updateReading(this.getOwnerComponent(), oModel);
				this.getView().byId("__barReading").setSelectedKey("Details");
				bizNetAccessReadings.loadReading(this.getView().getModel("Readings"), readingId);
			} else {
				sap.m.MessageToast.show("Please enter valid data in all fields", {});
			}
			this._clearNewAsset();
		},		
		
		removeReading : function(){
			
			var oModel = this.getView().getModel("Readings");
			bizNetAccessReadings.removeReading(this.getOwnerComponent(), oModel, oModel.getProperty("/selectedReading/VehicleID"));
		},		
		
		_clearNewAsset : function(){
			
			var oModel = this.getView().getModel("Readings");
			oModel.setProperty("/newReading/VehicleID","");
			oModel.setProperty("/newReading/ObjectType","");
			oModel.setProperty("/newReading/Reading","");
			oModel.setProperty("/newReading/CreationDate","");
		}
	});

});