SATO_Label_Generator_Service
==============

C# .NET classes and Javascript/JQuery/AJAX working together to generate Non-Standard labels for SATO Label Printers.

Type the printer's shared path or a file path into the input to generate the sample label to that location.  

Clarifications:

1.  The location must be on the server that is serving the site or read/write accessible to it. 
2.  You can specify a filename at the end of the printer string (i.e. \\MACHINE_NAME\LABEL_PRINTER_SHARE\LABEL.TXT)
3.  If you do not specify a filename at the end of the printer string (i.e. \\MACHINE_NAME\LABEL_PRINTER_SHARE\) it will generate a random filename
4.  The funky looking yellow label displayed after you successfully print a label is supposed to be a rough estimation of how the physical label should look when printed.  I planned to have a "label creation" page where you could customize labels via GUI, but I ended up not having a need for it so it was never finished.
  
