sap.ui.define([
    'ey/hr/payroll/controller/BaseController',
    "sap/ui/core/routing/History"
], function(BaseController, History) {
    'use strict';
    return BaseController.extend("ey.hr.payroll.controller.Supplier",{
        onInit: function(){
            //Get the router object
            this.oRouter = this.getOwnerComponent().getRouter();
            //Attach the RMH method
            this.oRouter.getRoute("supplier").attachMatched(this.herculis, this);
        },
        onBack: function(){
            //Chaining - single line w/o extra varibale
            //this.getView().getParent().to("idView1");
            //this.oRouter.navTo("home");

            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.navTo("home");
			}
        },
        herculis: function(oEvent){
            //Step 1: get the routing parameters
            var parameters = oEvent.getParameter("arguments");
            //Step 2: get supplier ID
            var sId = parameters.supplierId;
            //Step 3: Re-construct the path of supplier address
            var sPath = '/supplier/' + sId;
            //Step 4: Perform element binding
            this.getView().bindElement(sPath);
        }
    });
});