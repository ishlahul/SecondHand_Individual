/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.859375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "POST Register User Seller"], "isController": false}, {"data": [0.8, 500, 1500, "GET Buyer Order by id"], "isController": false}, {"data": [0.95, 500, 1500, "Get Login User"], "isController": false}, {"data": [0.9, 500, 1500, "DELETE Buyer Order"], "isController": false}, {"data": [0.5, 500, 1500, "POST Seller Product"], "isController": false}, {"data": [0.8, 500, 1500, "PUT Buyer Order by id"], "isController": false}, {"data": [0.95, 500, 1500, "DELETE Seller Product"], "isController": false}, {"data": [0.5, 500, 1500, "GET Buyer Product"], "isController": false}, {"data": [1.0, 500, 1500, "POST Buyer Order"], "isController": false}, {"data": [0.85, 500, 1500, "GET Buyer Order"], "isController": false}, {"data": [1.0, 500, 1500, "Get Seller Product by id"], "isController": false}, {"data": [1.0, 500, 1500, "POST Login User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Seller Product"], "isController": false}, {"data": [1.0, 500, 1500, "POST Register User Buyer"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Product by id"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 160, 0, 0.0, 547.0125000000002, 279, 2112, 360.0, 1199.8, 1248.3999999999999, 2055.8799999999987, 10.357998316825272, 35.41595860037548, 122.51784832815434], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Register User Seller", 10, 0, 0.0, 1187.5, 1116, 1249, 1206.5, 1247.8, 1249.0, 1249.0, 1.7400382808421784, 0.9464856664346616, 2.5886467939794677], "isController": false}, {"data": ["GET Buyer Order by id", 10, 0, 0.0, 603.5, 279, 2020, 315.5, 1972.0000000000002, 2020.0, 2020.0, 1.2822156686754713, 1.4149450250032054, 0.44952678227977944], "isController": false}, {"data": ["Get Login User", 10, 0, 0.0, 315.59999999999997, 279, 552, 289.5, 526.8000000000001, 552.0, 552.0, 2.0665426741062203, 1.1139956602603842, 0.7184464765447406], "isController": false}, {"data": ["DELETE Buyer Order", 10, 0, 0.0, 475.7, 280, 2020, 303.0, 1853.0000000000007, 2020.0, 2020.0, 1.2610340479192939, 0.4063879255989912, 0.5839671343001261], "isController": false}, {"data": ["POST Seller Product", 10, 0, 0.0, 1181.6, 1098, 1300, 1190.0, 1291.1000000000001, 1300.0, 1300.0, 1.7516202487300754, 1.1375268216850587, 318.23074038798393], "isController": false}, {"data": ["PUT Buyer Order by id", 10, 0, 0.0, 653.5999999999999, 287, 2112, 328.5, 2085.7000000000003, 2112.0, 2112.0, 1.266624445851805, 0.8361700443318556, 0.5850716434452186], "isController": false}, {"data": ["DELETE Seller Product", 10, 0, 0.0, 355.7, 290, 582, 329.0, 563.8000000000001, 582.0, 582.0, 1.2523481527864746, 0.3938047902316844, 0.5904625860989354], "isController": false}, {"data": ["GET Buyer Product", 10, 0, 0.0, 905.7, 819, 1090, 889.5, 1080.0, 1090.0, 1090.0, 1.8914318138831097, 77.90334783431058, 0.48394056175524874], "isController": false}, {"data": ["POST Buyer Order", 10, 0, 0.0, 329.9, 289, 393, 319.0, 391.6, 393.0, 393.0, 2.177226213803614, 1.4479404800783802, 0.9163911114739821], "isController": false}, {"data": ["GET Buyer Order", 10, 0, 0.0, 500.0, 279, 1919, 330.0, 1783.6000000000006, 1919.0, 1919.0, 1.6342539630658603, 1.80342478346135, 0.5713505066187285], "isController": false}, {"data": ["Get Seller Product by id", 10, 0, 0.0, 374.9, 289, 480, 379.5, 478.9, 480.0, 480.0, 2.061855670103093, 1.4215528350515465, 0.7288981958762887], "isController": false}, {"data": ["POST Login User", 20, 0, 0.0, 371.8, 345, 469, 360.0, 419.6, 466.65, 469.0, 2.5980774227071968, 1.2838156014549233, 0.7078746102883866], "isController": false}, {"data": ["Get Seller Product", 10, 0, 0.0, 344.79999999999995, 301, 407, 338.5, 405.2, 407.0, 407.0, 2.06996481059822, 1.4271437073069757, 0.7297434537362865], "isController": false}, {"data": ["POST Register User Buyer", 10, 0, 0.0, 395.3, 351, 460, 397.0, 457.0, 460.0, 460.0, 2.079002079002079, 1.1308634355509357, 3.067340176715177], "isController": false}, {"data": ["GET Buyer Product by id", 10, 0, 0.0, 384.79999999999995, 337, 488, 373.0, 482.1, 488.0, 488.0, 2.1556369907307613, 10.146650679025651, 0.5178581051950851], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 160, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
