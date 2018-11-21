sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"odoNet/model/modelsBase",
	"odoNet/model/modelsReadings",
	"odoNet/util/bizNetAccessReadings"
], function(
	JSONModel,
	UIComponent,
	Device,
	modelsBase,
	modelsReadings,
	bizNetAccessReadings
) {
	"use strict";

	return UIComponent.extend("odoNet.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			//Turn UI testing mode globally ON/OFF using the following
			this.setModel(modelsBase.createTestSwitchModel(false), "TestSwitch");

			// set the device model
			this.setModel(modelsBase.createDeviceModel(), "device");

			//set the sample assets model
			this.setModel(modelsReadings.createReadingsModel(), "Readings");
			
			//Chaincode Deployment Descriptor
			var that = this;
			$.ajax("./model/chaincodeDetails.json", {
				dataType: "json",
				async:false,
				success: function(data) {
					var oModel = new JSONModel(data);
					that.setModel(oModel, "ChaincodeDetails");
				}
			});

			// Initialize router
			this.getRouter().initialize();
		}
	});
});