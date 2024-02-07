sap.ui.define([
    
], function() {
    'use strict';
    return {
        getStatus: function(status){
            //Since the model was initialized by manifest file
            //the model is readily available @ Component.js level
            //Step 1: access the object of Component from Controller object
            var oComponent = this.getOwnerComponent();
            //Step 2: from the model access the entityset which has constant values
            var statuses =  oComponent.getModel().getProperty("/status");
            //Loop over everything to derive the value out
            for (let i = 0; i < statuses.length; i++) {
                const element = statuses[i];
                if(element.key === status){
                    return element.value;
                }
            }
        },
        getColorCode: function(status){
            //Since the model was initialized by manifest file
            //the model is readily available @ Component.js level
            //Step 1: access the object of Component from Controller object
            var oComponent = this.getOwnerComponent();
            //Step 2: from the model access the entityset which has constant values
            switch (status) {
                case "A":
                    return 'Success';
                    break;
                case "O":
                    return 'Warning';
                    break;
                case "D":
                    return 'Error';
                    break;
                case "P":
                    return 'Success';
                    break;
                default:
                    break;
            }
        }
    }
});