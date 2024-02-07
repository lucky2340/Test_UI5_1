sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("ey.hr.payroll.Component",{
        metadata: {
            manifest: "json"
        },
        init: function(){
            //we will call the parent class constructor
            UIComponent.prototype.init.apply(this);

            //Step 1: get the router object from parent class
            var oRouter = this.getRouter();

            //Step 2: initialize the router --SCAN the manifest file
            oRouter.initialize();
        },
        // createContent: function(){
        //     var oRootView = new sap.ui.view({
        //         viewName: 'ey.hr.payroll.view.App',
        //         id:'idRootView',
        //         type: 'XML'
        //     });

        //     //Obtain the object of container control
        //     //so later on we can add our views inside that
        //     var oAppCon = oRootView.byId("idAppCon");

        //     //Create our view objects
        //     var oView1 = new sap.ui.view({
        //         viewName: 'ey.hr.payroll.view.View1',
        //         id: 'idView1',
        //         type: 'XML'
        //     });

        //     var oView2 = new sap.ui.view({
        //         viewName: 'ey.hr.payroll.view.View2',
        //         id: 'idNaresh',
        //         type: 'XML'
        //     });

        //     var oEmpty = new sap.ui.view({
        //         viewName: 'ey.hr.payroll.view.Empty',
        //         id: 'idEmpty',
        //         type: 'XML'
        //     });

        //     //Integrate the pages inside
        //     oAppCon.addMasterPage(oView1).addDetailPage(oEmpty).addDetailPage(oView2);

        //     return oRootView;
        // },
        destroy: function(){

        }
    });
});