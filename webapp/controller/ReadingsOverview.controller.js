sap.ui.define([
	"odoNet/controller/BaseController",
	"odoNet/model/modelsBase",
	"odoNet/util/messageProvider",
	"odoNet/util/localStoreReadings",
	"odoNet/util/bizNetAccessReadings",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device"
], function(
		BaseController, 
		modelsBase, 
		messageProvider,
		localStoreReadings,
		bizNetAccessReadings, 
		History, 
		Filter, 
		FilterOperator, 
		Device
	) {
	"use strict";

	return BaseController.extend("odoNet.controller.ReadingsOverview", {

		onInit : function(){
			
			var oList = this.byId("readingsList");
			this._oList = oList;
			this._oListFilterState = {
				aFilter : [],
				aSearch : []
			};
			if ( this.getRunMode().testMode ){
				localStoreReadings.init();
			}		
			if ( typeof this.getOwnerComponent().getModel("Messages") === "undefined" ){
				this.getOwnerComponent().setModel(modelsBase.createMessagesModel(), "Messages");
			}
			messageProvider.init(this.getOwnerComponent().getModel("Messages"));
		},
		
		onAfterRendering: function() {
	
			this.loadEntityMetaData("reading", this.getModel("Readings"));
			bizNetAccessReadings.loadAllReadings(this, this.getModel("Readings"));
		},		
		
		onSelectionChange : function (oEvent) {
			
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},
		
		onAdd : function() {
			
			this.getRouter().navTo("reading", {readingId : "___new"});
		},
		
		onRemoveAll : function(){
			
			bizNetAccessReadings.removeAllReadings(this.getOwnerComponent(), this.getOwnerComponent().getModel("Readings"));          
		},		
		
		onSearch : function(oEvent) {
			
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("ID", FilterOperator.Contains, sQuery)];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();			
			var bReplace = !Device.system.phone;
			var oModel = this.getModel("Readings");
			oModel.setProperty(
				"/selectedReading",
				_.findWhere(oModel.getProperty("/readingCollection/items"), 
					{
						ID: oModel.getProperty("/searchReadingID")
					},
				this));
			this.getRouter().navTo("reading", {
				readingId : oModel.getProperty("/selectedReading").ID
			}, bReplace);			
		},
		
		_onToggle : function(){
			
			this.getOwnerComponent().getModel("TestSwitch").setProperty("/testMode",!(this.getView().byId("__buttonToggleReadings").getPressed()));
			var location = this.getRunMode().location;
			messageProvider.addMessage("Success", "Switching Network for Blockchain Data to: ", "No Description", location, 1, "", "http://www.sap.com");
			bizNetAccessReadings.loadAllReadings(this.getOwnerComponent(), this.getOwnerComponent().getModel("Readings"));
		},		
		
		_showDetail : function(oItem) {
			
			var bReplace = !Device.system.phone;
			var oModel = this.getModel("Readings");
			this.getRouter().navTo("reading", {
				readingId : oModel.getObject(oItem.getBindingContextPath()).VehicleID
			}, bReplace);
		},
		
		_applyFilterSearch : function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("Readings");
			this._oList.getBinding("items").filter(aFilters, "Application");
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("_labelNoReadingsText"));
			}
		},
		
		onMessagePress: function() {
			
			this.onShowMessageDialog("Reading Network Log");
		},		
		
		onNavBack : function() {
			this.getRouter().navTo("home");
		}		
	});
});