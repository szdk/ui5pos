sap.ui.define([
    "sap/m/MessageToast",
],
function (
    MessageToast
) {
    "use strict";

    let obj = {
        /**
         * 
         * @param {object} order = order fetched from model with expanded Order_Details and Customer
         */
        template1 : function (order, i18n) {
            
            let htmlBody = `
                <div style="color: #1d2d3e;font-family: &quot;Segoe UI&quot;, Verdana, Helvetica, Arial, sans-serif;" id="main-cnt">
                    <div style="padding: 0.5em 0.5em 0;"><img src="${sap.ui.require.toUrl("ui5pos/szdk/assets/logo.png")}" style="max-width: 100%;width: 15em;"></div>
                    <div style="
                        background: #1d2d3e;
                        color: white;
                        padding: 0 0.25em;
                        padding-bottom: 0.15em;
                        max-width: 100%;
                        padding-left: 0.6em;
                        margin-top: 0.5em;
                    "><span>github.com/szdk/ui5pos</span></div>
                    <div style="
                        text-align: center;
                        font-weight: bold;
                        font-size: 1.5em;
                        padding: 0.25em 1em;
                    ">${i18n.getText('receipt')}</div>
                    <div style="padding: 0.25em 0.5em;"> 
                        <table style="width:100%">
                            <tbody>
                                <tr style="font-weight:bold;"><td style="text-wrap: nowrap">${i18n.getText('order_id')}:</td><td style="text-align:end;">${order.OrderID}</td></tr>
                                <tr><td>${i18n.getText('print_order_time')}:</td><td style="text-align:end;">${order.OrderDate}</td></tr>
                            </tbody>
                        </table>
                        <div style="
                            display:flex;
                            justify-content:space-between;
                        ">
                            <table style="flex-grow: 1;">
                                <tbody>
                                    <tr><td>${i18n.getText('print_order_cust_id')}:</td><td>${order.CustomerID}</td></tr>
                                </tbody>
                            </table>
                            <table style="flex-grow: 1;">
                                <tbody>
                                    <tr><td>${i18n.getText('print_order_cust_phone')}:</td><td style="text-align:end">${order.Customer.Phone}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div style="
                        padding: 0.25em 0.75em;
                        font-weight: bold;
                    ">${i18n.getText('print_order_order_items')}:</div>

                    <div style="padding: 0.25em;">
                    <table style="
                        width: 100%;
                        border-collapse: collapse;
                    " id="items-tbl">
                        <thead>
                            <tr>
                                <td>${i18n.getText('print_order_id')}</td>
                                <td>${i18n.getText('print_order_name')}</td>
                                <td>${i18n.getText('print_order_unt_prc')}</td>
                                <td>${i18n.getText('print_order_qnt')}</td>
                                <td>${i18n.getText('print_order_dscnt')}</td>
                                <td>${i18n.getText('print_order_netprc')}</td>
                            </tr>
                        </thead>
                        <tbody>`;
                            let order_items = order.Order_Details && order.Order_Details.results || [];
                            let gross_price = 0;
                            for (let item of order_items) {
                                gross_price += parseFloat(item.UnitPrice) * parseFloat(item.Quantity);
                                htmlBody = htmlBody.concat(`
                                    <tr>
                                        <td>${item.ProductID}</td>
                                        <td colspan="5">${item.Product.ProductName}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td style="text-align:end;">$${parseFloat(item.UnitPrice).toFixed(2)}</td>
                                        <td style="text-align:end;">${parseInt(item.Quantity)}</td>
                                        <td style="text-align:end;">${(parseFloat(item.Discount) * 100).toFixed(1)}%</td>
                                        <td style="text-align:end;">$${(parseFloat(item.UnitPrice) * parseFloat(item.Quantity) * (1 - parseFloat(item.Discount))).toFixed(2)}</td>
                                    </tr>
                                `);
                            }

                        htmlBody = htmlBody.concat(`
                            <tr><td colspan="6"><div style="padding-bottom:2em;border-bottom: 2px dotted black;"></div></td></tr>
                            <tr>
                                <td colspan="5">${i18n.getText('print_order_total_items')}:</td>
                                <td style="text-align:end;">${order_items.length}</td>
                            </tr><tr>
                                <td colspan="5">${i18n.getText('print_order_gross_price')}:</td>
                                <td style="text-align:end;">$${gross_price.toFixed(2)}</td>
                            </tr><tr>
                                <td colspan="5">${i18n.getText('print_order_discount_amount')}:</td>
                                <td style="text-align:end;">$${(gross_price - order.Freight).toFixed(2)}</td>
                            </tr><tr style="">
                                <td colspan="5">${i18n.getText('print_order_total')}:</td>
                                <td style="
                                    font-weight: bold;
                                    font-size: 1.25em;
                                    text-align:end;
                                ">$${parseFloat(order.Freight).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="
                        margin: auto;
                        margin-top: 1.5em;
                        color: gray;
                        padding-bottom: 0.25em;
                    ">
                        <span style="display: block;">${i18n.getText('print_order_thank')}</span>
                        <span style="font-size: smaller;">${i18n.getText('print_order_credit')}</span>
                    </div>
                `);

            let css = `table tr {vertical-align: top;}
                html, body, table, #main-cnt {font-size : 16px;}
                @media (max-width : 510px) {html, body, table, #main-cnt {font-size: 14px;}}
                @media (max-width : 460px) {html, body, table, #main-cnt {font-size: 12px;}}
                table#items-tbl thead td {border: 1px solid black;padding: 0em 0.25em;}`;
            let win = window.open("", "", `popup=true,width=${Math.min(window.outerWidth, 550)},height=${Math.min(window.outerHeight, 730)},left=${parseInt(Math.max(0, window.outerWidth / 2 - 275))},top=${parseInt(Math.max(0, window.outerHeight / 2 - 315) * 0.75)}`);
            if (!win) {
                MessageToast.show(i18n.getText('print_failed_popup'), {
                    duration : 15000,
                    animationDuration : 1,
                });
                return;
            }
            let title = document.createElement('title');
            let style = document.createElement('style');
            title.innerText = i18n.getText('print_order_title');
            style.innerHTML = css;
            win.document.body.style.margin = '0';
            win.document.head.appendChild(title);
            win.document.head.appendChild(style);
            win.document.body.innerHTML = htmlBody;
        }
    };
    return obj;
}
);