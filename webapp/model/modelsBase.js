sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createTestSwitchModel:function(testMode){
		
			var oModel = new JSONModel();
			oModel.setDefaultBindingMode("OneWay");
			oModel.setData({
				testMode:testMode
			});
			return oModel;
		},
		
		createMessagesModel: function(){
		
			var oModel = new JSONModel();
			oModel.setDefaultBindingMode("TwoWay");
			oModel.setData({
				messageCount : 0,
				items: []
			});
			return oModel;			
		}
	};
});