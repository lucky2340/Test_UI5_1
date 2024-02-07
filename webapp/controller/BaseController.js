sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "ey/hr/payroll/util/formatter"
], function(Controller, myFormatter) {
    'use strict';
    return Controller.extend("ey.hr.payroll.controller.BaseController",{
        formatter: myFormatter
    });
});