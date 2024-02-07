sap.ui.define([
    'ey/hr/payroll/controller/BaseController',
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter"
], function(BaseController, History, MessageBox, MessageToast, Fragment, FilterOperator,Filter) {
    'use strict';
    return BaseController.extend("ey.hr.payroll.controller.View2",{
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
        oSupplierPopup: null,
        onSuppFilter: function(oEvent){
            //Create a copy of global this pointer to local variable so we can access
            //our controller object inside promise function
            var that = this;
            if (this.oSupplierPopup == null) {
                Fragment.load({
                    fragmentName: 'ey.hr.payroll.fragments.popup',
                    type: 'XML',
                    id:'supplier',
                    controller: this
                }).then(function(oFragment){
                    that.oSupplierPopup = oFragment;
                    that.oSupplierPopup.setTitle("Select Suppliers");
                    that.getView().addDependent(that.oSupplierPopup);
                    that.oSupplierPopup.bindAggregation("items",{
                        path: '/supplier',
                        template: new sap.m.StandardListItem({
                            title: '{name}',
                            description: '{person}',
                            icon: 'sap-icon://supplier'
                        })
                    });
                    that.oSupplierPopup.open();
                });
            }else{
                this.oSupplierPopup.open();
            }

        },
        //Create a global variable to avoid duplicate
        oCityPopup: null,
        oField: null,
        onF4Help: function(oEvent){
            //Take a snapshot of the table cell field on which F4 was fired
            this.oField = oEvent.getSource();
            var that = this;
            //IF lo_alv IS NOT INITIAL
            //Simple IF to check if we already by chance have the object of popup created previously
            if(this.oCityPopup == null){
                //Not created before
                Fragment.load({
                    fragmentName: 'ey.hr.payroll.fragments.popup',
                    type: 'XML',
                    id: 'cities',
                    controller: this
                })
                //then is a promise once the fragment is loaded --get the fragment object here
                .then(function(oFragment){
                    that.oCityPopup = oFragment;
                    that.oCityPopup.setTitle("Choose your city");
                    that.oCityPopup.setMultiSelect(false);
                    //explicitly allowing parasite to access body parts using immune system
                    //immune system = View , parasite = fragment, body part = model
                    that.getView().addDependent(that.oCityPopup);
                    that.oCityPopup.bindAggregation("items",{
                        path: '/cities',
                        template: new sap.m.StandardListItem({
                            title: '{name}',
                            description: '{state}'
                        })
                    });
                    that.oCityPopup.open();
                });
            }else{
                //Already created
                this.oCityPopup.open();
            }
            //MessageBox.confirm("This functionality is under construction 😊"); 
        },
        onSearchPopup: function (oEvent) {
            //Step1: extract the value search by user
            var sVal = oEvent.getParameter("value");
            //Step2: Build the filter object
            var oFilter = new Filter("name", FilterOperator.Contains, sVal);
            //Step3: Get the binding of source control (select dialog)
            var oBinding = oEvent.getSource().getBinding("items");
            //Step4: Inject the filter
            oBinding.filter(oFilter);
        },
        onPopupConfirm: function(oEvent){
            var sId = oEvent.getSource().getId();
            //Step1: Find which item was selected by user
            var oSelectedItem = oEvent.getParameter("selectedItem");
            //Step2: Extract the title of selected item
            var sText = oSelectedItem.getTitle();
            if(sId.indexOf("cities") !== -1){
                //Set the value to the cell of the table on which F4 was fired
                this.oField.setValue(sText);
            }else{
                //here we will write logic for filtering data inside the table
                //Step 1: get all selected items in the popup fragment
                var aItems = oEvent.getParameter("selectedItems");
                //Step 2: Loop over each item and make a filter array
                var aFilters = [];
                for (let i = 0; i < aItems.length; i++) {
                    const element = aItems[i];
                    var oFilter = new Filter("name", FilterOperator.EQ, element.getTitle());
                    aFilters.push(oFilter);
                }
                //Step 3: Make a global filter with OR condition
                var oFinalFilter = new Filter({
                    filters: aFilters,
                    and: false
                });
                //Step 4: Get the table object
                var oTable = this.getView().byId("idSupplier");
                //Step 5: Get the binding of the table
                var oBinding = oTable.getBinding("items");
                //Step 6: inject filter to the binding
                oBinding.filter(oFinalFilter);
            }
            
            
        },
        onSave: function(){
            //local variable in caller function which will be accessed by event handler
            var that = this;
            //Show confirmation message to the user
            MessageBox.confirm("Would you like to save your fruit order",{
                title: 'Anubhav App',
                //when we attach a function to event dynamically (in JS), the function will never
                //have access to the 'this' pointer, since we need 'this' object inside the function,
                //we can pass it explicitly to event handler using two techniques 
                //1. Dynamic binding of this pointer to the event handler ===> .bind(this)
                //2. Create a local variable in caller function which will be In-scope to the called function, (use anonymous function)
                onClose : function(status){
                    that.testFunction();
                    if (status === "OK") {
                        MessageToast.show("The order was created successfully");
                    }else{
                        MessageBox.alert("Order was not created");
                    }
                }
            })
        },
        onSupplierNav: function(oEvent){
            //Step 1: extract the detail of which item was clicked
            var oSelectedItem = oEvent.getParameter("listItem");
            //Step 2: get the element path
            var sPath = oSelectedItem.getBindingContextPath();
            console.log(sPath);
            //Step 3: Extract the index of the selected item from the path
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            //Step 4: Ask router to navigate also pass the index to route
            this.oRouter.navTo("supplier",{
                supplierId : sIndex
            });
        },
        myMessageClose: function(status){
            this.testFunction();
            if (status === "OK") {
                MessageToast.show("The order was created successfully");
            }else{
                MessageBox.alert("Order was not created");
            }
        },
        onReject: function(){
            MessageBox.error("OOps! the action was cancelled 😒");
        },
        testFunction: function(){
            MessageBox.alert("I am a controller function");
        },
        onInit: function(){
            //step1: get the router object
            this.oRouter = this.getOwnerComponent().getRouter();
            //step2: register the route matched handler event
            //"this" is the object of current controller, which we need to also
            //explicitly pass to our herculis function so that the function can access
            //our controller object
            //ROUTER.event(Which_Function, CONTROLLEROBJECT)
            this.oRouter.getRoute("detail").attachMatched(this.herculis, this);
        },
        ninja: "Ninja Turtle",
        herculis: function(oEvent){
            //if i want to access my controller object as this pointer,
            //i must receive it from caller
            //this.globalVariableController
            //alert(this.ninja);

            //Step1: get the fruit ID from the event object
            //which will tell us which fruit was selected
            var sId = oEvent.getParameter("arguments").fruitId;
            //Step2: Reconstruct the FRUIT address of element
            var sPath = "/" + sId;
            //Step3: Bind the view with the element
            this.getView().bindElement(sPath,{
                expand: 'To_Supplier'
            });

        }
    });
});