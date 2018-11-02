function SatoPrinter() {
    var me = this;

    this.code_type = 'non-standard';
    this.JobIdNumber = 0;
    this.JobName = '';
    this.dotsPerMm = 8; //for 203 dpi print heads, 12 for 305, 24 for 609
    this.size =  {
        width: 4,
        height: 4
    };
    this.illegal_characters = [ '{', '}', '^', '~', '@', '!', ']'];
    this.commands = new Commands();
    this.fonts = new Fonts();

    this.initializeReferences = function() {
        me.currentPosition =  {
            baseReference: [0,0],
            horizontal: 0,
            vertical: 0,
            rotation: 0,
            expansion: [0,0],
            darkness: 0,
            quantity: 1
        };
        
        me.barcode = {
            type: '',
            narrowSpace: '',
            wideSpace: '',
            narrowBar: '',
            wideBar: ''
        };
    };
    me.initializeReferences();

    this.executeCommand = function(command, code) {
        var segments = code.split(command.command);
        try {
            var params = segments[1];
        } catch (e) {
            var params = [];
        }
        switch (command.type) {
            case 'Control':
                switch (command.command) {
                    case 'A':
                        me.initializeReferences(); //do this on end of label instead?
                        return '<div class="label" style="position:relative;height:812px;width:812px;background-color:yellow;border:1px solid black;">';
                    case 'Z':
                        //TODO: if quantity is greater than 1 then make that many labels
                        return '</div>';
                    case 'Q':
                        me.quantity = parseInt(params.trim());
                        return '';
                    case 'ID':
                        //TODO
                        return '';
                    case 'WK':
                        //TODO
                        return '';
                    case 'CR':
                        //TODO
                        return '';
                    default:
                        return '';
                };
            case 'Print Position':
                switch (command.command) {
                    case 'H':
                        me.currentPosition.horizontal = parseInt(params.trim());
                        return '';
                    case 'V':
                        me.currentPosition.vertical = parseInt(params.trim());
                        return '';
                    default:
                        return '';
                };
            case 'Modification':
                switch (command.command) {
                    case 'P':
                        return '';
                    case 'L':
                        if ((params.length < 4) || (isNaN(parseInt(params)))) {
                            console.error('incorrect parameters');
                            return '';
                        }
                        var x = parseInt(params.substr(0,2));
                        var y = parseInt(params.substr(2));
                        me.currentPosition.expansion = [x,y];    
                        return '';
                    case 'PS':
                        return '';
                    case 'PR':
                        return '';
                    case '%':
                        var rotative_direction = parseInt(params.trim());
                        var rotation = 0;
                        if (isNaN(rotative_direction)) {
                            console.error('incorrect parameters');
                            return '';
                        }
                        switch(rotative_direction) {
                            case 1:
                                rotation = 0;
                                break;
                            case 2:
                                rotation = 270;
                                break;
                            case 3:
                                rotation = 180;
                                break;
                            case 4:
                                rotation = 90;
                                break;
                            default:
                                rotation = 0;
                                break;
                        };
                        me.currentPosition.rotation = rotation;
                        return '';
                    case 'R':
                        switch (me.currentPosition.rotation) {
                            case 0:
                                me.currentPosition.rotation = 270;
                                break;
                            case 90:
                                me.currentPosition.rotation = 0;
                                break;
                            case 180:
                                me.currentPosition.rotation = 90;
                                break;
                            case 270:
                                me.currentPosition.rotation = 180;
                                break;
                            default:
                                me.currentPosition.rotation -= 90;
                                if (me.currentPosition.rotation < 0) {
                                    me.currentPosition.rotation += 360;
                                }
                                break;
                        };
                        return '';
                    case 'N':
                        me.currentPosition.rotation = 0;
                        return '';
                    case 'F':
                        var p = params.split(',');
                        var required_params;
                        if (p[0].indexOf('+') > -1) {
                            required_params = p[0].split('+');
                        } else if (p[0].indexOf('-') > -1) {
                            required_params = p[0].split('-');
                        } else {
                            console.error('incorrect parameters');
                            return '';
                        }
                        //TODO: figure out how this works and finish implementation
                        return '';
                    case 'FW':
                        return '';
                    case 'FC':
                        return '';
                    case 'FT':
                        return '';
                    case '(':
                        return '';
                    case 'KC':
                        return '';
                    case '&':
                        return '';
                    case '/':
                        return '';
                    case '0':
                        return '';
                    case 'WD':
                        return '';
                    case 'J':
                        return '';
                    case 'RF':
                        return '';
                    case 'RM':
                        return '';
                    case 'KS':
                        return '';
                    default:
                        return '';
                };
            case 'Font':
                switch (command.command) {
                    default:
                        //TODO: factor in text espansion and darkess
                        var font = me.fonts.get(command.command);
                        console.log(command.command);
                        console.log(font);
                        var x = me.currentPosition.baseReference[0] + me.currentPosition.horizontal;
                        var y = me.currentPosition.baseReference[1] + me.currentPosition.vertical;
                        var css = 'white-space:nowrap;overflow:visible;'
                            + 'position:absolute;left:' + x + 'px;top:' + y + 'px;'
                            + 'font-size:' + font.dotHeight + 'px;'
                            + 'transform:rotate(' + me.currentPosition.rotation  + 'deg);';
                        return '<div style="' + css + '">' 
                            + params 
                            + '</div>';
                };
            case 'Barcode':
                switch (command.command) {
                    case 'BT':
                        if ((params.length < 9) || (isNaN(parseInt(params)))) {
                            console.error('incorrect parameters');
                            return '';
                        }
                        switch(parseInt(params[0])) {
                            case 0:
                                me.barcode.type = 'CODABAR (NW-7)';
                                break;
                            case 1:
                                me.barcode.type = 'CODE39';
                                break;
                            case 2:
                                me.barcode.type = 'ITF';
                                break;
                            case 5: 
                                me.barcode.type = 'Industrial 2of5';
                                break;
                            case 6:
                                me.barcode.type = 'Matrix 2of5';
                                break;
                            default:
                                me.barcode.type = 'CODE39';
                                break;
                        }; 
                        me.barcode.narrowSpace = parseInt(params.substr(1,2));
                        me.barcode.wideSpace = parseInt(params.substr(3,2));
                        me.barcode.narrowBar = parseInt(params.substr(5,2));
                        me.barcode.wideBar = parseInt(params.substr(7,2));
                        return '';
                    case 'BW':
                        if ((params.length < 8) || (params.indexOf('*') == -1)){
                            console.error('incorrect parameters');
                            return '';
                        }
                        var p = params.split('*');
                        var narrowBar = p[0].substr(0,2);
                        var barcodeHeight = p[0].substr(2,3);
                        var printData = p[1];
                        var x = me.currentPosition.baseReference[0] + me.currentPosition.horizontal;
                        var y = me.currentPosition.baseReference[1] + me.currentPosition.vertical;
                        var css = 'position:absolute;left:' + x + 'px;top:' + y + 'px;white-space:nowrap;overflow:visible;'
                            + 'transform:rotate(' + me.currentPosition.rotation  + 'deg);';
                        var barcode_info = 'jsbarcode-format="' + me.barcode.type + '" '
                            + 'jsbarcode-value="' + printData + '" ';
                        var barcode_id = Date.now();
                        return '<svg id="barcode' + barcode_id + '" style="' + css + '" ' + barcode_info + '></svg>'
                            + '<script>'
                            + 'JsBarcode("#barcode' + barcode_id + '").init();'
                            + 'document.querySelector("#barcode' + barcode_id + '").setAttribute("style","' + css + '");'
                            + '</script>';
                    default:
                        return '';
                };
            case '2D Code':
                switch (command.command) {
                    default:
                        return '';
                };
            case 'Graphic':
                switch (command.command) {
                    default:
                        return '';
                };
            case 'System':
                switch (command.command) {
                    default:
                        return '';
                };
            case 'Calendar Command':
                switch (command.command) {
                    default:
                        return '';
                };
            case 'Memory Card':
                switch (command.command) {
                    default:
                        return '';
                };
            case 'Intelligent':
                switch (command.command) {
                    default:
                        return '';
                };
            case 'RFID':
                switch (command.command) {
                    default:
                        return '';
                };
            case 'Common Commands for All Languages':
                switch (command.command) {
                    default:
                        return '';
                };
            default:
                return '';
        };
    };

    this.html = function(code) {
        var html = '';
        me.initializeReferences();
        var segments = code.split('^');
        for (var i = 0; i < segments.length; i++) {
            var segment = segments[i];
            if (segment.length == 0) {
                continue;
            }

            //process commands
            var command = me.commands.softGet(segment);
            console.log(segment);
            console.log(command);
            if (command) {
                html += me.executeCommand(command, segment);
            }
        }
        return html;
    };
}

function SatoLabel() {
    var me = this;
    
    this.code = '';
    this.commands = {
        command: '^',
        startData: '{',
        endData: '}',
        outlineFontDesignSelection: '$',
        outlineFontPrint: '$='
    };

    this.addCode = function(code) {
        me.code += code;
    };

    this.text = function() {
        return me.code;
    };

    this.initialize = function() {
        me.code = [];
    };

    this.startLabel = function() {
        me.addCode(me.commands.command 
            + 'A'); 
    };

    this.endLabel = function() {
        me.addCode(me.commands.command
            + 'Z');
    };

    this.setLabelQuantity = function(quantity) {
        me.addCode(me.commands.command
            + 'Q' + quantity.toString());
    };

    this.setRotation = function(value) {
        me.addCode(me.commands.command
            + '%' + value.toString());
    };

    this.setBaseReference = function(x, y) {
        me.addCode(me.commands.command
            + 'A3' 
            + 'H' + x.toString() 
            + 'V' + y.toString());
    };

    this.setHorizontal = function(x) {
        me.addCode(me.commands.command
            + 'H' + x.toString());
    };

    this.setVertical = function(y) {
        me.addCode(me.commands.command
            + 'V' + y.toString());
    };

    this.setPosition = function(x, y) {
        me.setHorizontal(x);
        me.setVertical(y);
    };

    this.setFont = function(font) {
        me.addCode(me.commands.command
            + font);
    };

    this.setDarkness = function(value) {
        me.addCode(me.commands.command
            + 'E' + value);
    };

    this.ExpandFont = function(x, y) {
        me.addCode(me.commands.command
            + 'L' + x + y);
    };

    this.ReverseImage = function(left, top, right, bottom) {
        me.addCode(me.commands.command
            + '(' + right.toString()
            + ',' + bottom.toString());
    };

    this.sequenceNumbering = function(repeatCount, stepSize) {
        me.addCode(me.commands.command
            + 'F' + repeatCount + stepSize);
    };

    this.setBarcodeRatio = function(sCode, sSymbol, narrowSpaceInDots, wideSpanceInDots, narrowBarInDots, wideBarInDots) { //AKA Barcode2
        //formatting needed
        me.addCode(me.commands.command
            + sCode + sSymbol
            + narrowSpaceInDots + wideSpanceInDots
            + narrowBarInDots + wideBarInDots);
    };

    this.barcode3 = function(sCode, expFactor, heightInDots) {
        me.addCode(me.commands.command
            + sCode + expFactor + heightInDots);
    };

    this.addCarriageReturn = function() {
        me.addCode('\n');
    };

    this.addText = function(x, y, font, text) {
        me.setPosition(x, y);
        me.setFont(font);
        me.addCode(text);
    };

    this.addBarcode = function(x, y, data) {
        me.setPosition(x, y);
        me.addCode(me.commands.command + 'F0001+0001' 
            + me.commands.command + 'BT101020103'
            + me.commands.command + 'BW03100*' 
            + data + '*');
    };

    this.addVerticalBarcode = function(x, y, data) {
        me.setPosition(x, y);
        me.addCode(me.commands.command + 'F0001+0001'
            + me.commands.command + 'BT101020103'
            + me.commands.command + 'BW03050*' + data + '*');
        me.setRotation(0);
    };

    this.addVectorText = function(x, y, text) {
        me.setPosition(x, y);
        me.addCode(me.commands.command + '$B,320,200,0'
            + me.commands.command + '$=' + text
            + me.commands.command + 'L0101'); 
    };

    this.helloWorld= function() {
        me.initialize();
        me.startLabel();
        me.addText(0,0,'M','HELLO WORLD');
        me.endLabel();
    };
}

function Font(name, dotWidth, dotHeight) {
    var me = this;
    
    this.name = (name || '');
    this.dotWidth = (dotWidth || 0);
    this.dotHeight = (dotHeight || 0);

    this.getMillimeterWidth = function(conversionFactor) {
        return (me.dotWidth / conversionFactor);
    };

    this.getMillimeterHeight = function(conversionFactor) {
        return (me.dotHeight / conversionFactor);
    };
}

function Fonts() {
    var me = this;
    this.fonts =  [
        new Font("",0,0),
        new Font("XU",5,9),
        new Font("XS",17,17),
        new Font("XM",24,24),
        new Font("XB0",48,48),
        new Font("XB1",48,48),
        new Font("XL",48,48),
        new Font("U",5,9),
        new Font("S",8,15),
        new Font("M",13,20),
        new Font("M1",13,20),
        new Font("ML",13,20),
        new Font("WB",18,30),
        new Font("WB0",18,30),
        new Font("WB1",18,30),
        new Font("WL",28,52),
        new Font("X20",5,9),
        new Font("X21",17,17),
        new Font("X22",24,24),
        new Font("X23",48,48),
        new Font("X24",48,48),
        new Font("K1",16,16),
        new Font("K2",24,24),
        new Font("K3",22,22),
        new Font("K4",32,32),
        new Font("K5",40,40),
        new Font("K8",16,16),
        new Font("K9",24,24),
        new Font("KA",22,22),
        new Font("KB",32,32),
        new Font("KD",40,40)
    ];

    this.get = function(command) {
        for (var i = 0; i < me.fonts.length; i++) {
            var font = me.fonts[i];
            if (font.name == command) {
                return font;
            }
        }
    };
}

function Command(type, number, command, description, page) {
    var me = this;

    this.type = (type || '');
    this.number = (number || '');
    this.command = (command || '');
    this.description = (description || '');
    this.page = (page || 0);
}

function Commands() {
    var me = this;
    this.commands = [
        //Control
        new Command('Control','5-1','A','Start Code',10),
        new Command('Control','5-2','Z','Stop Code',11),
        new Command('Control','5-3','Q','Print Quantity',12),
        new Command('Control','5-4','ID','Job ID Number',13),
        new Command('Control','5-5','WK','Job Name',14),
        new Command('Control','5-6','CR','Status 5 Reply Check',15),
        //Print Position
        new Command('Print Position','6-1','H','Horizontal Print Position',16),
        new Command('Print Position','6-2','V','Horizontal Print Position',17),
        //Modification
        new Command('Modification','7-1','P','Character Pitch',18),
        new Command('Modification','7-2','L','Character Pitch',19),
        new Command('Modification','7-3','PS','Character Pitch',20),
        new Command('Modification','7-4','PR','Character Pitch',21),
        new Command('Modification','7-5','%','Character Pitch',22),
        new Command('Modification','7-6','R','Character Pitch',23),
        new Command('Modification','7-7','N','Character Pitch',24),
        new Command('Modification','7-8','F','Character Pitch',25),
        new Command('Modification','7-9','FW','Character Pitch',26),
        new Command('Modification','7-10','FC','Character Pitch',27),
        new Command('Modification','7-11','FT','Character Pitch',28),
        new Command('Modification','7-12','(','Character Pitch',29),
        new Command('Modification','7-13','KC','Character Pitch',30),
        new Command('Modification','7-14','&','Character Pitch',31),
        new Command('Modification','7-15','/','Character Pitch',32),
        new Command('Modification','7-16','0','Character Pitch',33),
        new Command('Modification','7-17','WD','Character Pitch',34),
        new Command('Modification','7-18','J','Character Pitch',35),
        new Command('Modification','7-19','RF','Character Pitch',36),
        new Command('Modification','7-20','RM','Character Pitch',37),
        new Command('Modification','7-21','KS','Character Pitch',39),
        //Font
        new Command('Font','8-1','X20','X20 Font (Basic size 5x9 dots)',40),
        new Command('Font','8-2','X21','X21 Font (Basic size 17x17 dots)',42),
        new Command('Font','8-3','X22','X22 Font (Basic size (24x24 dots)',44),
        new Command('Font','8-4','X23','X23 Font (Basic size 48x48 dots)',46),
        new Command('Font','8-5','X24','X24 Font (Basic size 48x48 dots)',48),
        new Command('Font','8-6','XU','XU Font (Basic size 5x9 dots)',50),
        new Command('Font','8-7','XS','XS Font (Basic size 17x17 dots)',52),
        new Command('Font','8-8','XM','XM Font (Basic size 24x24 dots)',54),
        new Command('Font','8-9','XB','XB Font (Basic size 48x48 dots)',56),
        new Command('Font','8-10','XL','XL Font (Basic size 48x48 dots)',58),
        new Command('Font','8-11','OA','OCR-A Font',60),
        new Command('Font','8-12','OB','OCR-B Font',62),
        new Command('Font','8-13','U','U Font (Basic size 5x9 dots)',64),
        new Command('Font','8-14','S','S Font (Basic size 5x9 dots)',66),
        new Command('Font','8-15','M','M Font (Basic size 13x20 dots)',68),
        new Command('Font','','M1','',0),
        new Command('Font','','ML','',0),
        new Command('Font','8-16','WB','WB Font (Basic size 18x30 dots)',70),
        new Command('Font','','WB1','',0),
        new Command('Font','8-17','WL','WL Font (Basic size 28x52 dots)',72),
        new Command('Font','8-18','$','Outline Font Design',74),
        new Command('Font','8-19','$=','Outline Font Print',76),
        new Command('Font','8-20','RD','CG Font',78),
        new Command('Font','8-21','RG','Multiple language',82),
        new Command('Font','8-22','RH','Scalable Font',86),
        new Command('Font','8-23','K1','16x16 dots Kanji in horizontal line',89),
        //Barcode
        new Command('Barcode','9-1','B','Barcode (Ratio 1:3)',121),
        new Command('Barcode','9-2','D','Barcode (Ratio 1:2)',123),
        //new Command('Barcode','9-3','DD','Barcode (with HRI)',125),
        new Command('Barcode','9-4','BD','Barcode (Ratio 2:5)',126),
        new Command('Barcode','9-5','BT','Barcode Ratio Registration',128),
        new Command('Barcode','9-6','BW','Print of Barcode by Specified Ratio',129),
        new Command('Barcode','9-7','BC','CODE 93 Barcode',132),
        new Command('Barcode','9-8','BF','UPC Add-on (Bookland)',134),
        new Command('Barcode','9-9','TU','CODE128 Barcode',136),
        new Command('Barcode','9-10','BI','GS1-128(UCC/EAN 128) (Standard Carton ID Only)',140),
        new Command('Barcode','9-11','BP','Postnet',142),
        new Command('Barcode','9-12','BS','USPS Barcode',144),
        new Command('Barcode','9-13','EU','Composite symbol',146),
        new Command('Barcode','9-14','BL','UPC-A Barcode (Without HRI)',150),
        //new Command('Barcode','9-15','BLD','UPC-A Barcode (Without HRI)',151),
        new Command('Barcode','9-16','BM','UPC-A Barcode (With HRI)',153),
        new Command('Barcode','9-17','BZ','Customer Barcode',154),
        //2D Code
        new Command('2D Code','10-1','2D10','PDF417',156),
        new Command('2D Code','10-2','2D12','Micro PDF417',159),
        new Command('2D Code','10-3','2D20','MAXI Code',162),
        new Command('2D Code','10-4','2D30','QR Code (Model 2)',164),
        new Command('2D Code','10-5','2D31','QR Code (Model 1)',168),
        new Command('2D Code','10-6','2D32','Micro QR Code',171),
        new Command('2D Code','10-7','2D50','Datamatrix (ECC200)',196),
        new Command('2D Code','10-8','2D51','GS1 Datamatrix',199),
        new Command('2D Code','10-9','BQ','QR Code',202),
        new Command('2D Code','10-10','BV','Maxi Code',227),
        new Command('2D Code','10-11','BK','PDF417',229),
        new Command('2D Code','10-12','BX','Datamatrix (ECC200)',232),
        new Command('2D Code','10-13','DC','Datamatrix (ECC200) Data Specify',233),
        new Command('2D Code','10-14','FX','Datamatrix (ECC200) Sequential Number',234),
        new Command('2D Code','10-15','QV','QR code version',236),
        //Graphic
        new Command('Graphic','11-1','G','Graphic Print',237),
        new Command('Graphic','11-2','GM','BMP File Print',238),
        new Command('Graphic','11-3','GP','PCX File Print',239),
        //System
        new Command('System','12-1','CS','Print Speed',240),
        new Command('System','12-2','#F','Print Darkness',241),
        new Command('System','12-3','#E','Print Darkness (Compatible command)',242),
        new Command('System','12-4','A1','Media Size',243),
        new Command('System','12-5','A3','Base Reference Point',245),
        new Command('System','12-6','EP','Print End Position',246),
        new Command('System','12-7','~','Multiple Cut',247),
        new Command('System','12-8','CT','Cut Number Unit',248),
        new Command('System','12-9','NC','Eject and Cut',249),
        new Command('System','12-10','~A','Cut Number Unit',250),
        new Command('System','12-11','~B','Eject and Cut',251),
        new Command('System','12-12','*','Memory Clear',252),
        new Command('System','12-13','@','Offline',253),
        new Command('System','12-14','C','Reprint',254),
        new Command('System','12-15','E','Auto Line Feed',255),
        new Command('System','12-16','PO','Offset',256),
        new Command('System','12-17','IG','Sensor Type',257),
        new Command('System','12-18','PH','Print Method',258),
        new Command('System','12-19','PM','Print Mode',259),
        new Command('System','12-20','KM','Mincho (Kanji)',260),
        new Command('System','12-21','KG','Gothic (Kanji)',261),
        new Command('System','12-22','CE','European code page',262),
        new Command('System','12-23','TK','Forced Tear Off',264),
        new Command('System','12-24','TW','Option Waiting Time',265),
        new Command('System','12-25','CL','Delete CR/LF',266),
        //Calendar Command
        new Command('Calendar Command','13-1','WT','Calendar Setup',267),
        new Command('Calendar Command','13-2','WP','Calendar Arithmetic (Add)',268),
        new Command('Calendar Command','13-3','WA','Calendar Print',269),
        //Memory Card
        new Command('Memory Card','14-1','CC','Card Slot for Use',271),
        new Command('Memory Card','14-2','FM','Memory Card Initialization',272),
        new Command('Memory Card','14-3','BJF','Memory Card Initialization',273),
        new Command('Memory Card','14-4','FP','Memory Card Status Print',274),
        new Command('Memory Card','14-5','BJS','Memory Card Status Print',275),
        new Command('Memory Card','14-6','&S','Form Overlay Registration',276),
        new Command('Memory Card','14-7','&R','Form Overlay Call',278),
        new Command('Memory Card','14-8','YS','Format Registration',279),
        new Command('Memory Card','14-9','/N','Registration of Field',282),
        new Command('Memory Card','14-10','YR','Format Call',283),
        new Command('Memory Card','14-11','/D','Print of Field',284),
        new Command('Memory Card','14-12','GI','Registration of Graphic',285),
        new Command('Memory Card','14-13','GR','Graphic Call',286),
        new Command('Memory Card','14-14','GT','BMP File Registration',287),
        new Command('Memory Card','14-15','GC','BMP File Call',288),
        new Command('Memory Card','14-16','PI','PCX File Registration',289),
        new Command('Memory Card','14-17','PY','PCX File call',290),
        new Command('Memory Card','14-18','*','Memory Card Clear',291),
        new Command('Memory Card','14-19','T1','Memory Card 16x16 dots External Font Registration',292),
        new Command('Memory Card','14-20','T2','Memory Card 24x24 dots External Font Registration',293),
        new Command('Memory Card','14-21','K1','Horizontal Writing External Font Call',296),
        new Command('Memory Card','14-21','K2','Horizontal Writing External Font Call',296),
        new Command('Memory Card','14-22','k1','Vertical Writing External Font Call',297),
        new Command('Memory Card','14-22','k2','Vertical Writing External Font Call',297),
        new Command('Memory Card','14-23','BJ','True Type Font Registration',298),
        new Command('Memory Card','14-23','BJD','True Type Font Registration',298),
        new Command('Memory Card','14-24','BJT','True Type Font Call',299),
        
        //Intelligent
        new Command('Intelligent','15-1','IK','Label Feed Control',300),
    
        //RFID
        new Command('RFID','16-1','IP0','EPC Code Write',303),
        new Command('RFID','16-2','F','EPC Code Write',314),
        new Command('RFID','16-3','IP5','EPC Code Write',315),
        new Command('RFID','16-4','TM','EPC Code Write',317),
        new Command('RFID','16-5','TU','EPC Code Write',318),
        new Command('RFID','16-6','RU','EPC Code Write',321),
    
        //Common Commands for All Languages
        new Command('Common Commands for All Languages','17-1','PA','Print Setting Command',325),
        new Command('Common Commands for All Languages','17-2','PB','Printer Information Acquisition',345),
        new Command('Common Commands for All Languages','17-3','PC','Printer Device Information Acquisition',348),
        new Command('Common Commands for All Languages','17-4','PD','Each Sensor Information Acquisition',352),
        new Command('Common Commands for All Languages','17-5','PG','Printer Status Information Acquisition',354),
        new Command('Common Commands for All Languages','17-6','PH','Cancel Request',357),
        new Command('Common Commands for All Languages','17-7','PI','Application Change',358),
        new Command('Common Commands for All Languages','17-8','PJ','EPC Code Read',360),
        new Command('Common Commands for All Languages','17-9','PK','EPC/TID Return Request',362),
        new Command('Common Commands for All Languages','17-10','DB','Initialization',364),
        new Command('Common Commands for All Languages','17-11','DC','Reset',366),
        new Command('Common Commands for All Languages','17-12','DD','Power Off',367),
        new Command('Common Commands for All Languages','17-13','DE','File Download',368),
        new Command('Common Commands for All Languages','17-14','DF','File Name Information Acquisition',370),
        new Command('Common Commands for All Languages','17-15','DG','File Information Acquisition',372),
        new Command('Common Commands for All Languages','17-16','DH','File Deletion',374)
    ];

    this.get = function(segment) {
        for (var i = 0; i < me.commands.length; i++) {
            var command = me.commands[i];
            if (command.command == segment) {
                return command;
            }
        }
    };

    this.softGet = function(segment) {
        var list = [];
        for (var i = 0; i < me.commands.length; i++) {
            var command = me.commands[i];
            if (segment.startsWith(command.command)) {
                list.push(command);
            }
        }
        var best_matching_command;
        for (var i = 0; i < list.length; i++) {
            var command = list[i];
            if (!best_matching_command) {
                best_matching_command = command;
            } else if (command.command.length > best_matching_command.command.length) {
                best_matching_command = command;                
            }
        }
        return best_matching_command;
    }
}