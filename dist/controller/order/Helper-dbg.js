sap.ui.define([
    "ui5pos/szdk/controller/customer/CustomerHelper"
],
    function (CustomerHelper) {
        "use strict";

        let obj = {
            
            /**
                order = {
                    OrderID?,
                    CustomerID? (if CustomerID is not provided, then customer parameter is required, so that a new customer can be created)
                    OrderDate : Date() object
                },
                order_details : [
                    {
                        ProductID,
                        UnitPrice,
                        Quantity,
                        Discount,
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
            //Note: this needs to be bound to CreateOrder controller
            create : function (order, order_details, customer) {
                let resolve = () => {}, reject = () => {};
                let prom = new Promise((res, rej) => {
                    resolve = res;
                    reject = rej;
                });
                

                if (!order.CustomerID) {
                    //create customer first
                    return (CustomerHelper.create.bind(this))(customer)
                        .then((data) => {
                            if (!data || !data.CustomerID) {
                                throw new Error({message : 'Customer creation failed', data});
                            } else {
                                order = {...order};
                                order.CustomerID = data.CustomerID;
                                return (obj.create.bind(this))(order, order_details);
                            }
                        });
                }

                //generate order id first (if required)
                if (!order.OrderID && (this.comp.getModel('settings').getProperty('/odata/useMock') || this.comp.getModel('settings').getProperty('/odata/generateID'))) {
                    return this.getMaxValue('/Orders', 'OrderID')
                        .then(maxID => {
                            if (parseInt(maxID)) {
                                order = {...order};
                                order.OrderID = parseInt(maxID) + 1;
                                return (obj.create.bind(this))(order, order_details);
                            } else
                                throw new Error('max order id fetch failed');
                        })
                    return prom;
                }

                //merge duplicate products (if in case any) in order_detail
                let prodmap = {};
                for (let od of order_details) {
                    if (!prodmap[od.ProductID]) {
                        prodmap[od.ProductID] = {...od};
                    } else {
                        prodmap[od.ProductID].Quantity += od.Quantity;
                    }
                }
                order_details = [];
                for (let id in prodmap) {
                    order_details.push({...prodmap[id]});
                }

                //calculate order total
                order.Freight = 0;
                for (let od of order_details)
                    order.Freight += od.UnitPrice * od.Quantity * (1 - od.Discount);

                //create order
                let service = this.comp.getModel('service');
                service.create('/Orders', order, {
                    success : (data) => {
                        if (!data || !parseInt(data.OrderID)) {
                            reject({message : 'order creation failed', dataReturned : data});
                            return;
                        }

                        //create order details in batch
                        let updateQuantity = this.comp.getModel('settings').getProperty('/odata/useMock') || this.comp.getModel('settings').getProperty('/odata/updateQuantity');

                        let products = {};

                        const createEntries = () => {
                            for (let od of order_details) {
                                od = {...od};
                                od.OrderID = parseInt(data.OrderID);
                                    
                                service.createEntry('/Order_Details', {
                                    properties : od
                                });
    
                                if (updateQuantity && products[od.ProductID]) {
                                    service.setProperty(`/Products(${od.ProductID})/UnitsInStock`, Math.max(0, (parseInt(products[od.ProductID].UnitsInStock) || 0) - od.Quantity));
                                }
                            }
                            service.submitChanges({
                                success : (item_data) => {
                                    resolve(data);
                                },
                                error : reject
                            });
                        };

                        if (updateQuantity) {
                            let ids = [];
                            for (let item of order_details)
                                ids.push(item.ProductID);
                            this.fetchProducts(ids)
                                .then((products_data) => {
                                    if (products_data && products_data.length > 0) {
                                        for (let prod of products_data) {
                                            products[prod.ProductID] = prod;
                                        }
                                    }
                                    createEntries();
                                })
                                .catch(() => createEntries());
                        } else
                            createEntries();
                    },
                    error : reject
                });

                return prom;
            },

            
            /**
                order = {
                    OrderID,
                    CustomerID? (if CustomerID is not provided, then customer parameter is required, so that a new customer can be created)
                    OrderDate? : Date() object (if provided, creation date would be updated)
                },
                order_details : [
                    {
                        ProductID,
                        UnitPrice,
                        Quantity,
                        Discount,
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
            //Note : this needs to be bound to CreateOrder controller
            update : function (order, order_details, customer) {
                let resolve = () => {}, reject = () => {};
                let prom = new Promise((res, rej) => {
                    resolve = res;
                    reject = rej;
                });
                if (!order.OrderID) {
                    reject({message : 'OrderID not provided', order});
                    return prom;
                }

                if (!order.CustomerID) {
                    //create customer first
                    return (CustomerHelper.create.bind(this))(customer)
                        .then((data) => {
                            if (!data || !data.CustomerID) {
                                throw new Error({message : 'Customer creation failed', data});
                            } else {
                                order = {...order};
                                order.CustomerID = data.CustomerID;
                                return (obj.update.bind(this))(order, order_details);
                            }
                        });
                }

                //merge duplicate products (if in case any) in order_detail
                let prodmap = {};
                for (let od of order_details) {
                    if (!prodmap[od.ProductID]) {
                        prodmap[od.ProductID] = {...od};
                    } else {
                        prodmap[od.ProductID].Quantity += od.Quantity;
                    }
                }
                order_details = [];
                for (let id in prodmap) {
                    order_details.push({OrderID : order.OrderID, ...prodmap[id]});
                }

                //calculate order total
                order.Freight = 0;
                for (let od of order_details)
                    order.Freight += od.UnitPrice * od.Quantity * (1 - od.Discount);

                let service = this.comp.getModel('service');
                let map_prev = {};
                let map_cur = {};
                let items_changes = {
                    create : [],
                    update : [],
                    delete : [],
                };
                let products_data = {}
                this.fetchOrder(order.OrderID)
                    .then((prev_order) => {
                        return prev_order.Order_Details && prev_order.Order_Details.results || [];
                    })
                    .then((prev_items) => {
                        for (let item of prev_items)
                            map_prev[item.ProductID] = item;
                        for (let item of order_details)
                            map_cur[item.ProductID] = item;

                        //seperate items which need to be created, updated, and deleted
                        for (let id in map_prev) {
                            if (!map_cur[id])
                                items_changes.delete.push(id);
                        }
                        for (let id in map_cur) {
                            if (!map_prev[id])
                                items_changes.create.push(id);
                            else
                                items_changes.update.push(id);
                        }
                        //fetch products details
                        return this.fetchProducts([
                            ...items_changes.create,
                            ...items_changes.update,
                            ...items_changes.delete
                        ]).then((tmp_data) => temp_data || []);
                    }).then((tmp_prods) => {
                        for (let prod of tmp_prods)
                            products_data[prod.ProductID] = prod;
                        //delete items
                        for (let item of items_changes.delete) {
                            // service.
                        }
                    });

                //todo


            }
        };
        return obj;
    }
);
            // s.create(`/Customers('ASDFX')`, {Phone : '612345983434', ContactName : '2Sajid'}, {success : console.log, error : console.error});