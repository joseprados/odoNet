sap.ui.define([
	"sap/m/MessageView",
	"sap/m/MessagePopoverItem",
	"sap/m/Link"
		], function(MessageView, MessagePopoverItem, Link) {
	"use strict";

		var oLink = new Link({
			text: "Show more information",
			href: "http://sap.com",
			target: "_blank"
		});
	
		var oMessageTemplate = new MessagePopoverItem({
			type: "{type}",
			title: "{title}",
			description: "{description}",
			subtitle: "{subtitle}",
			counter: "{counter}",
			groupName: "{group}",
			link: oLink
		});
		
		var oMessageView = new MessageView({
			items: {
				path: "/items",
				template: oMessageTemplate
			},
			groupItems: true
		});
		
		var oModel = [];
		
	return {

		init:function(mModel){
			
			this.setModel(mModel);
			this.initMessages();
		},
		
		setModel:function(mModel){
			
			this.oModel = mModel;
		},
		
		getMessageView:function() {
		
			oMessageView.setModel(this.oModel);
			return oMessageView;
		},
		
		initMessages:function (){

			this.oModel.setProperty("/messageCount",0);
			this.oModel.setProperty("/items", []);
		},

		addMessage:function(type, title, description, subtitle, counter, group, link){

			var oMessages = this.oModel.getProperty("/items");
			oMessages.push({
				type		: type,
				title		: title,
				description	: description,
				subtitle	: subtitle,
				counter		: counter,
				groupName	: group,
				link		: new sap.m.Link({text:"Show more information", href:link, target: "_blank"})
			});
			this.oModel.setProperty("/items",oMessages);
			this.oModel.setProperty("/messageCount", this.oModel.getProperty("/messageCount") + 1 );			
		}
	};
});