sap.ui.define([
    "ui5pos/szdk/controller/customer/CustomerHelper"
],
    function (CustomerHelper) {
        "use strict";

        let obj = {
            //this needs to be bound to controller
            /**
                order = {
                    OrderID?,
                    CustomerID? (if CustomerID is not provided, then customer parameter is required, so that a new customer can be created)
                    Freight : order total
                    OrderDate : Date() object
                },
                order_details : [
                    {
                        ProductID,
                        UnitPrice,
                        Quantity,
                        Discount
                    },
                    ...
                ],
                customer : {
                    Phone
                    ContactName?
                    Address?
                    City?
                    PostalCode?
                    Country?
                }
             */
            create : function (order, order_details, customer) {
                let resolve = () => {}, reject = () => {};
                let prom = new Promise((res, rej) => {
                    resolve = res;
                    reject = rej;
                });

                if (!order.CustomerID) {
                    //create customer first
                    CustomerHelper.create(customer)
                        .then((data) => {
                            if (!data || !data.CustomerID) {
                                reject({message : 'Customer creation failed', data});
                            } else {
                                order = {...order};
                                order.CustomerID = data.CustomerID;
                                prom = obj.create(order, order_details);
                            }
                        })
                        .catch(reject);
                    return prom;
                }

                //generate order id first (if required)
                if (
                    !order.OrderID &&
                    (
                        this.comp.getModel('settings').getProperty('/odata/useMock') ||
                        this.comp.getModel('settings').getProperty('/odata/generateID')
                    )
                ) {
                    this.getMaxValue('/Orders', 'OrderID')
                        .then(maxID => {
                            if (parseInt(maxID)) {
                                order = {...order};
                                order.OrderID = parseInt(maxID) + 1;
                                prom = obj.create(order, order_details);
                            } else
                                reject('max order id fetch failed');
                        })
                        .catch(reject);
                    return prom;
                }

                //create order
                let service = this.comp.getModel('service');
                service.create('/Orders', order, {
                    success : (data) => {
                        if (!data || !parseInt(data.OrderID)) {
                            reject({message : 'order creation failed', dataReturned : data});
                        } else {
                            //create order details in batch
                            for (let od of order_details) {
                                od = {...od};
                                od.OrderID = parseInt(data.OrderID);

                                //TODO TODO TODO TODO TODO TODO TODO TODO TODO 
                                service.createEntry('/Order_Details', )
                                
                            }

                        }
                    },
                    error : reject
                });

                return prom;
            }
        };
        return obj;
    }
);
            // s.create(`/Customers('ASDFX')`, {Phone : '612345983434', ContactName : '2Sajid'}, {success : console.log, error : console.error});