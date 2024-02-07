sap.ui.define([
    'ey/hr/payroll/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    "sap/ui/core/Fragment"
], function(BaseController, JSONModel, MessageBox, MessageToast, Fragment ) {
    'use strict';
    return BaseController.extend("ey.hr.payroll.controller.Add",{
        onInit: function(){
            //Create local JSON  model
            var oJsonModel = new JSONModel();
            //get the payload from postman tool and set to the local model
            oJsonModel.setData({
                "prodData" : {
                    "PRODUCT_ID": "",
                    "TYPE_CODE": "PR",
                    "CATEGORY": "Notebooks",
                    "NAME": "",
                    "DESCRIPTION": "",
                    "SUPPLIER_ID": "0100000046",
                    "SUPPLIER_NAME": "SAP",
                    "TAX_TARIF_CODE": "1 ",
                    "MEASURE_UNIT": "EA",
                    "PRICE": "0.00",
                    "CURRENCY_CODE": "USD",
                    "DIM_UNIT": "CM",
                    "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/"
                }
            });
            //Set the model to our  view as named model
            this.getView().setModel(oJsonModel, "hunk");
            //Create global variable for ease of use for local model
            this.oLocalModel = oJsonModel;
        },

        onProductSubmit:function(oEvent){
            //Extract the product id entered by user
            var sVal = oEvent.getParameter("value");
            //Get the oData model object
            var oDataModel = this.getOwnerComponent().getModel();
            //Call the odata service to load single  product data
            var that = this;
            oDataModel.read("/ProductSet('" + sVal + "')",{
                success: function(data){
                    //Set this data to local model - 2 way binding
                    that.oLocalModel.setProperty("/prodData", data);
                    //Change the mode to update
                    that.setMode("Update");
                },
                error: function(oErr){
                    MessageToast.show("The product does not exist, please proceed with creation");
                    //To do: extract message coming from SAP and print in console
                    console.log(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                }
            });
        },

        onSave: function(){
            //Get the payload data
            var payload = this.oLocalModel.getProperty("/prodData");
            //Validate the data
            if (!payload.PRODUCT_ID) {
                MessageBox.error("Empty Product ID is not allowed");
                return;
            }
            //Get the Odata model object
            var oDataModel = this.getOwnerComponent().getModel();
            if (this.mode === "Create"){
                //Trigger the POST call to SAP using odata model method CREATE
                oDataModel.create("/ProductSet", payload, {
                    //Success: to handle if the post was successful
                    success: function(data){
                        MessageToast.show("WoW! the product is created in SAP")
                        },
                    //Error: to handle if the POST failed
                    error: function(oErr){
    
                       }
                });
            }else{
                //Trigger the POST call to SAP using odata model method CREATE
                oDataModel.create("/ProductSet", payload, {
                    //Success: to handle if the post was successful
                    success: function(data){
                        MessageToast.show("WoW! the product is created in SAP")
                        },
                    //Error: to handle if the POST failed
                    error: function(oErr){
                        //Trigger the POST call to SAP using odata model method CREATE
                        oDataModel.update("/ProductSet('" + payload.PRODUCT_ID + "')", payload, {
                            //Success: to handle if the post was successful
                            success: function(data){
                                MessageToast.show("Bingo! The update has been done")
                            },
                            //Error: to handle if the POST failed
                            error: function(oErr){
                                MessageBox.error("Hola! the update crashed");
                            }
                        });
                    }
                });
            }
        },
        mode:"Create",
        setMode:function(sMode){
            if (sMode === "Create") {
                //Setting create mode ----> Save,all fields are eneble mode                
                this.getView().byId("idSave").setText("Save");
                this.getView().byId("idProdId").setEnabled(true);
                this.getView().byId("idDelete").setEnabled(false);
            }else{
                //Edit Mode ---> Update, product id must be locked
                this.getView().byId("idSave").setText("Update");
                this.getView().byId("idProdId").setEnabled(false);
                this.getView().byId("idDelete").setEnabled(true);
            }
            this.mode = sMode;
        },

        onClear: function(){
            this.setMode("Create");
            this.oLocalModel.setProperty("/prodData",{
                    "PRODUCT_ID": "",
                    "TYPE_CODE": "PR",
                    "CATEGORY": "Notebooks",
                    "NAME": "",
                    "DESCRIPTION": "",
                    "SUPPLIER_ID": "0100000046",
                    "SUPPLIER_NAME": "SAP",
                    "TAX_TARIF_CODE": "1 ",
                    "MEASURE_UNIT": "EA",
                    "PRICE": "0.00",
                    "CURRENCY_CODE": "USD",
                    "DIM_UNIT": "CM",
                    "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/"
            })
        },
        onPopupConfirm: function(oEvent){
            var sId = oEvent.getSource().getId();
            //Step1: Find which item was selected by user
            var oSelectedItem = oEvent.getParameter("selectedItem");
            //Step2: Extract the title of selected item
            var sBPId = oSelectedItem.getTitle();
            var sCompanyName = oSelectedItem.getDescription();
            this.oLocalModel.setProperty("/prodData/SUPPLIER_ID", sBPId);
            this.oLocalModel.setProperty("/prodData/SUPPLIER_NAME", sCompanyName);
        },        
        oSupplierPopup: null,
        onF4Supplier:function(){
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
                        path: '/SupplierSet',
                        template: new sap.m.StandardListItem({
                            title: '{BP_ID}',
                            description: '{COMPANY_NAME}',
                            icon: 'sap-icon://supplier'
                        })
                    });
                    that.oSupplierPopup.open();
                });
            }else{
                this.oSupplierPopup.open();
            }

        },
        onLoadExp: function(){
            //Know the category selected by User
            var cat = this.oLocalModel.getProperty("/prodData/CATEGORY");
            //Get Odata model object
            var oDataModel = this.getOwnerComponent().getModel();
            //Call the function import
            var that = this;
            oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters: {
                    I_CATEGORY: cat
                },
                success: function(data){
                    //Set data to local model once success callback
                    //Set this data to local model - 2 way binding
                    that.oLocalModel.setProperty("/prodData", data);
                    //Change the mode to update
                    that.setMode("Update");
                },
                error:function(){

                }
            });
        },

        onDelete:function(oEvent){
            //Get the key of product to be deleted
            var prodId = this.oLocalModel.getProperty("/prodData/PRODUCT_ID");
            //Get the odata model object
            var oDataModel = this.getOwnerComponent().getModel();
            //call the odata to perform delete operation
            oDataModel.remove("/ProductSet('" + prodId + "')", {
                success: function(){
                    MessageBox.confirm("The Product was deleted");
                },
                error: function(){

                }
            });
        }

    });
});