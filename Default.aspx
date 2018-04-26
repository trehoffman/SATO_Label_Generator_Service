<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>
<html>
    <head>
        <title>SATO Label Generation Test Page</title>
        <link rel="stylesheet" href="css/style.css" />
        <link rel="stylesheet" href="css/label.css" />
        <script src="https://code.jquery.com/jquery-2.2.4.min.js"
            integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
            crossorigin="anonymous"></script>
    </head>
    <body>
        <div class="background_cover">
            <h1>SATO Label Print Test</h1>
            <div>
                <input id="label_printer_path" placeholder="Label Printer Path" value="\\MACHINE_NAME\LABEL_PRINTER_SHARE\" /> <button onclick="callService();">Print SATO Label</button>
            </div>
            <div class="label-preview"></div>
            <div class="progress_log"></div>
        </div>
        <script src="js/label.js"></script>
    </body>
</html>
