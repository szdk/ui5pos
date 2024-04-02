sap.ui.define([],
function () {
    "use strict";
    let obj = {
        /**
         * @param {*} customer = {
         *          Phone
         *          ContactName?
         *          Address?
         *          City?
         *          PostalCode?
         *          Country?
         *      }
         */
        //note this should be bound to the controller
        create : function (customer) {
            let resolve = () => {}, reject = () => {};
            let prom = new Promise((res, rej) => {
                resolve = res; reject = rej;
            });
            
            const create = (data) => {
                this.comp.getModel('service').create('/Customers', data, {
                    success : (data) => {
                        if (data && data.CustomerID) {
                            resolve(data);
                        } else {
                            reject({message : 'customr id generation failed', data});
                        }
                    },
                    error : reject
                });
            }

            if (this.comp.getModel('settings').getProperty('/odata/useMock') || this.comp.getModel('settings').getProperty('/odata/generateID')) {
                this.getMaxValue('/Customers', 'CustomerID')
                    .then((id) => {
                        customer.CustomerID = obj.incrementID(id);
                        create(customer);
                    })
                    .catch(reject);
            } else {
                create(customer);
            }
            return prom;
        },

        incrementID : function (id) {
            //convert to integer
            let num = 0;
            for (let i = 0; i < id.length; i++) {
                num *= 26;
                num += id.charCodeAt(i) - 64;
            }
            //increment id
            num++;
            //convert back to string
            let arr = [];
            while (num > 0) {
                let rem = num % 26;
                if (rem == 0) {
                    rem = 26;
                    num -= 26;
                }
                num = parseInt(num / 26);
                arr.push(String.fromCharCode(rem + 64));
            }
            if (arr.length > id.length)
                return 'A'.repeat(id.length);
            else
                return arr.reverse().join('');
        }
    };
    return obj;
});