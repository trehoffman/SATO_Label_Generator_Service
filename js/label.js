var label_printer_path = "\\\\TREVOR32\\Users\\trevor\\SharedFolder\\";
var label_data = {
    iNumPieces: 5,
    iPieceStart: 2,
    iPieceEnd: 4,
    sLabelPrinterPath: label_printer_path
};

function callService() {
    console.log("callService");
    label_printer_path = $("#label_printer_path").val().trim();

    label_data.sLabelPrinterPath = label_printer_path;

    console.log(label_data);
    createLabel().done(createLabelSuccess).fail(createLabelFailure);
}

function createLabel() {
    console.log("createLabel");
    $(".progress_log").append("Trying to call service...<br><br>");
    return $.ajax({
        type: "POST", //GET or POST or PUT or DELETE verb
        url: "/Service.svc/CreateSatoLabel", // Location of the service
        data: JSON.stringify(label_data), //Data sent to server
        contentType: "application/json; charset=utf-8", // content type sent to server
        dataType: "json", //Expected data format from server
        processdata: true, //True or False
        async: true,
        cache: false
    });
}

function createLabelSuccess(msg) {
    console.log("createLabelSuccess");
    $(".progress_log").append("Service call succeeded!<br><br>");
    var result = msg.d;

    if (result === "OK") {
        $(".progress_log").append("Label Printing succeeded to " + label_printer_path + "<br><br>");
    } else {
        $(".progress_log").append("Label Printing failed to " + label_printer_path + "<br><br>" + result + "<br><br>");
    }
}

function createLabelFailure(msg) {
    console.log("createLabelFailure");
    console.log(msg);
    if (msg) {
        $(".progress_log").append("AJAX call to service failed!\n\nStatus: " + msg.status + "<br><br>" + msg.statusText + "<br><br>");
    } else {
        $(".progress_log").append('AJAX call to service failed!' + "<br><br>");
    }
}