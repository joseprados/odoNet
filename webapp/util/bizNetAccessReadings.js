sap.ui.define([
	"odoNet/util/restBuilder",
	"odoNet/util/formatterReadings",
	"odoNet/util/localStoreReadings"
], function(
				restBuilder,
				formatterReadings, 
				localStoreReadings
			) {
	"use strict";

	return {

		loadAllReadings:function(oComponent, oModel) {

			if ( !( oComponent.getModel("TestSwitch").getProperty("/testMode") ) ){
				restBuilder.execute(
					oModel.getProperty("/chaincode"), 
					"readAll",
					[],
					function(responseData){
						oModel.setProperty(
							"/readingCollection/items",
							formatterReadings.mapReadingsToModel(responseData)
						);
					});
			} else {
				oModel.setProperty(
					"/readingCollection/items",
					formatterReadings.mapReadingsToModel(localStoreReadings.getReadingData())
				);
			}
		},

		loadReading:function(oModel, selectedReadingVehicleID){

			oModel.setProperty(
				"/selectedReading",
				_.findWhere(oModel.getProperty("/readingCollection/items"), 
					{
						VehicleID: selectedReadingVehicleID
					},
				this));
		},

		addNewReading:function(oComponent, oModel){
			var fnSuccess = function(){
			    MessageToast.show("New reading has been submitted and will be displayed as soon as the reading is recorded on the blockchain. Please wait.");
			};
			if ( !( oComponent.getModel("TestSwitch").getProperty("/testMode") ) ){
				restBuilder.execute(
					oModel.getProperty("/chaincode"), 
					"addNew",
					formatterReadings.mapReadingToChaincode(oModel, true)

				);
			}  else {
				localStoreReadings.put(formatterReadings.mapReadingToLocalStorage(oModel));
			}
			this.loadAllReadings(oComponent, oModel);
			return oModel.getProperty("/newReading/VehicleID");
		},
		
		updateReading : function(oComponent, oModel){
			var fnSuccess = function(){
            	MessageToast.show("Updated reading has been submitted and will be displayed as soon as the reading is recorded on the blockchain. Please wait.");
            };
			if ( !( oComponent.getModel("TestSwitch").getProperty("/testMode") ) ) {
				restBuilder.execute(
					oModel.getProperty("/chaincode"), 
					"update",
					formatterReadings.mapReadingToChaincode(oModel, false)

				);
			} else {
				localStoreReadings.update(oModel);
			}
			this.loadAllReadings(oComponent, oModel);
			return oModel.getProperty("/selectedReading/VehicleID");
		},
		
		removeAllReadings : function(oComponent, oModel){
			
			if ( !( oComponent.getModel("TestSwitch").getProperty("/testMode") ) ) {
				restBuilder.execute(
					oModel.getProperty("/chaincode"), 
					"removeAll",
					[]
				);
			} else {
				localStoreReadings.removeAll();
			}
			this.loadAllReadings(oComponent, oModel);
			oModel.setProperty("/selectedReading",{});
			return true;
		}		
	};	
});