/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"odoNet/util/messageProvider",
	"odoNet/model/modelsBase",
	"sap/ui/core/routing/History"
], function (
		Controller, 
		messageProvider, 
		modelsBase, 
		JSONModel, 
		History
	) {
	"use strict";

	return Controller.extend("odoNet.controller.BaseController", {
		
		loadEntityMetaData:function(entityName,oModel){
		
			var eModel = this.getOwnerComponent().getModel("ChaincodeDetails");
			oModel.setProperty(
				"/chaincode/serviceUrl",
				eModel.getProperty("/serviceURL")
			);
			oModel.setProperty(
				"/chaincode/serviceKey",
				eModel.getProperty("/serviceKey")
			);
			oModel.setProperty(
				"/chaincode/entity",
				_.findWhere(
					eModel.getProperty("/entityCollection"),
					{
						name:entityName
					}
				)
			);
		},
		getRouter:function() {
			
			return this.getOwnerComponent().getRouter();
		},

		getModel:function(sName) {
			
			return this.getOwnerComponent().getModel(sName);
		},

		setModel:function(oModel, sName) {
			
			return this.getOwnerComponent().setModel(oModel, sName);
		},

		getResourceBundle : function () {
			
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		
		getRunMode:function(){
			var mode = this.getOwnerComponent().getModel("TestSwitch").getProperty("/testMode");
			if (mode){
				return {
					testMode	: true,
					location	: "Local Network"
				};
			} else {
				return {
					testMode	: false,
					location	: "Remote Network (SAP BaaS)"
				};
			}			
		},
		
		showMessageStrip:function(msgStripID, msg, type){
			switch (type){
				case "S":
					msgStripID.setType(sap.ui.core.MessageType.Information);
					break;
				case "W":
					msgStripID.setType(sap.ui.core.MessageType.Warning);
					break;
				case "E":
					msgStripID.setType(sap.ui.core.MessageType.Error);
					break;
			}
			msgStripID.setText(msg);
			msgStripID.setVisible(true);			
		},		
		
		onToggleRunMode:function(msgStripID){
			var oModel = this.getOwnerComponent().getModel("TestSwitch");
			var mode = oModel.getProperty("/testMode");
			oModel.setProperty("/testMode", !mode);
			if (!mode) {
				this.showMessageStrip(msgStripID, "Switching to: " + this.getRunMode().location, "S");
			} else {
				this.showMessageStrip(msgStripID, "Switching to : " + this.getRunMode().location, "S");
			}			
		},
		
		onShowMessageDialog: function(title){
			var oDialog = new sap.m.Dialog({
				content			: messageProvider.getMessageView(this.getOwnerComponent().getModel("Messages")),            
				title			: title,
				contentHeight	: "440px",
				contentWidth	: "640px",
				endButton		: new sap.m.Button({
									text: "Close",
									press: function() {
										oDialog.close();
									}
				}),
				verticalScrolling: false
			}).open();
		},
		
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("assets", {}, true);
			}
		}		
	});
});