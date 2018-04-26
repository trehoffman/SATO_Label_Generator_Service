var label_printer_path = "\\\\localhost\\SharedFolder\\";
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
    createLabel().done(function (msg) {
        console.log("createLabelSuccess");
        console.log(msg);
        if (msg.d.Result == "OK") {
            $(".progress_log").append("Service call succeeded!<br><br>");
            $(".label-preview").html(msg.d.Data);
        } else {
            $(".progress_log").append("Error<br><br>");
            $(".label-preview").html(msg.d.Result);
        }
    }).fail(function (msg) {
        console.log("createLabelFailure");
        console.log(msg);
        if (msg) {
            $(".progress_log").append("AJAX call to service failed!\n\nStatus: " + msg.status + "<br><br>" + msg.statusText + "<br><br>");
        } else {
            $(".progress_log").append('AJAX call to service failed!' + "<br><br>");
        }
    });
}

function createLabel() {
    console.log("createLabel");
    $(".progress_log").append("Trying to call service...<br><br>");
    return $.ajax({
        type: "POST",
        url: "/Default.aspx/CreateSatoLabel",
        data: JSON.stringify(label_data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    });
}