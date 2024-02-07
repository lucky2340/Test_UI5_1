sap.ui.define([
    'ey/hr/payroll/controller/BaseController',
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter"
], function(BaseController, FilterOperator, Filter) {
    'use strict';
    return BaseController.extend("ey.hr.payroll.controller.View1",{
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
        },
        onNext: function(sFruitID){
            // //Step 1 : go to mother - app container object
            // var oAppCon = this.getView().getParent().getParent();
            // //Step 2: mother will call second child - navigate to view2
            // //how you obtained the view 2 object to pass here?
            // var oView2 = oAppCon.getDetailPages()[1];
            // //pass the object of the view2
            // oAppCon.toDetail(oView2);
            this.oRouter.navTo("detail",{
                fruitId: sFruitID
            });
        },
        onDelete: function(oEvent){
            //Step1 : get the object of the list control
            var oList = this.getView().byId("idList");
            //Step2: get the selected items from the list
            var aSelections = oList.getSelectedItems();
            console.log(aSelections);
            //Step3: Loop over these items and delete them one by one
            aSelections.forEach(element => {
                oList.removeItem(element);
            });
        },  
        //Every event handler suppose to get the event object
        onItemDelete: function(oEvent){
            //get the object of selected item to mark for deletion
            var oItemToBeDeleted = oEvent.getParameter("listItem");
            //Get the list control object
            var oList = oEvent.getSource();
            //Delete the item from the list
            oList.removeItem(oItemToBeDeleted);
        },
        onItemSelect: function(oEvent){
            //Step1: When item is selected, we get to know which item was selected (getting the row)
            var oSelectedItem = oEvent.getParameter("listItem");
            //Step2: get the path of the selected item (element address)
            var sAddress = oSelectedItem.getBindingContextPath();
            //Step3: get the object of view 2 (getting simple form)
            //var oView2 = this.getView().getParent().getParent().getDetailPages()[1];
            //Step4: element binding to the target control (oSimple.bindElement(spath))
            //oView2.bindElement(sAddress);

            // -- /fruit/3 ==> 
           // debugger;
            var sMyId = sAddress.split("/")[sAddress.split("/").length - 1];

            this.onNext(sMyId);
        },
        onSearch: function(oEvent){
            //Step1: Read the value entered by user for search of data
            var sVal = oEvent.getParameter("query");
            if(!sVal){
                sVal = oEvent.getParameter("newValue");
            }
            //Step2: Take the value and make a search condition using filter object
            var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains, sVal);
            // var oFilter2 = new Filter("taste", FilterOperator.Contains, sVal);
            // //Step3: Get the binding of list items
            // var oBinding = this.getView().byId("idList").getBinding("items");
            // //StepExtra: We need to perform an OR with conditions
            // var oFilter = new Filter({
            //     filters: [oFilter1, oFilter2],
            //     and: false
            // });
            //Step4: Inject the search condition to the binding
            oBinding.filter(oFilter1);
        },
        onAddProduct: function(){
            this.oRouter.navTo("add");
        }
    });
});