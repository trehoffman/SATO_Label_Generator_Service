function SatoLabel() {
    var me = this;
    this.code_type = "non-standard";
    this.code = [];
    this.dotsPerMm = 8; //for 203 dpi print heads, 12 for 305, 24 for 609
    this.size =  {
        width: 4,
        height: 4
    };
    this.currentPosition =  {
        baseReference: [0,0],
        horizontal: 0,
        vertical: 0
    };
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
    ],
    this.font = {
        font: new Font(),
        darkness: 0,
        expansion: [0,0],
        rotation: 0
    };
    this.commands = {
        command: '^',
        startData: '{',
        endData: '}',
        outlineFontDesignSelection: '$',
        outlineFontPrint: '$='
    };
    this.illegal_characters = [ '{', '}', '^', '~', '@', '!', ']'];

    this.text = function() {
        return me.code.join('');
    };

    this.html = function() {
        var html = '';
        var brackets = [];
        var command_started = false;
        var horizontal_position = 0;
        var vertical_position = 0;

        var segment = me.text();
        for (var j = 0; j < segment.length; j++) {
            var character = segment[j];
            console.log(character);
            switch (character) {
                case '{':
                    brackets.push(character);
                    break;
                case '}':
                    if (brackets.length == 0) {
                        alert('missing starting bracket');
                        return '';
                    }
                    brackets.pop();
                    break;
                case '^':
                    command_started = true;
                    break;
                case 'A':
                    if (!command_started) {
                        alert("command not started");
                        return '';
                    }
                    command_started = false;
                    break;
                case 'H':
                    if (!command_started) {
                        alert("command not started");
                        return '';
                    }
                    //get next four characters and determine position value
                    var position = '';
                    for (var k = j + 1; k < j + 5; k++) {
                        if (k == segment.length) {
                            alert('code ends unexpectedly');
                            return '';
                        }
                        var c = segment[k];
                        console.log(c);
                        if (isNaN(c)) {
                            break;
                        } else {
                            position += c;
                        }
                    }
                    if (position == '') {
                        alert('position not specified');
                        return;
                    }
                    horizontal_position = parseInt(position);
                    j += position.length;
                    break;
                case 'V':
                    if (!command_started) {
                        alert("command not started");
                        return '';
                    }
                    //get next four characters and determine position value
                    var position = '';
                    for (var k = j + 1; k < j + 5; k++) {
                        if (k == segment.length) {
                            alert('code ends unexpectedly');
                            return '';
                        }
                        var c = segment[k];
                        if (isNaN(c)) {
                            break;
                        } else {
                            position += c;
                        }
                    }
                    if (position == '') {
                        alert('position not specified');
                        return;
                    }
                    vertical_position = parseInt(position);
                    j += position.length;
                    break;
                case 'M':
                    if (!command_started) {
                        alert("command not started");
                        return '';
                    }
                    //get next characters up to a command or carriage return
                    var text = '';
                    for (k = j + 1; k < segment.length; k++) {
                        if (k == segment.length) {
                            alert('code ends unexpectedly');
                            return '';
                        }
                        var c = segment[k];
                        if ((c == '^') || (c == '/')) {
                            break;
                        } else {
                            text += c;
                        }
                    }
                    html += '<div style="width:' + horizontal_position + 'in;height:' + vertical_position + 'in;white-space:nowrap;overflow:visible;">' + text + '</div>';
                    j += text.length;
                    break;
                case 'Z':
                    if (!command_started) {
                        alert("command not started");
                        return '';
                    }
                    command_started = false;
                    break;
                default:
                    break;
            }
        }
        return html;
    };

    this.initialize = function() {
        me.code = [];
    };

    this.startLabel = function() {
        me.code.push(me.commands.startData 
            + me.commands.command 
            + 'A'); 
    };

    this.endLabel = function() {
        me.code.push(me.commands.command
            + 'Z' + me.commands.endData);
    };

    this.setLabelQuantity = function(quantity) {
        me.code.push(me.commands.command
            + 'Q' + quantity.toString());
    };

    this.setRotation = function(value) {
        me.code.push(me.commands.command
            + '%' + value.toString());
    };

    this.setBaseReference = function(x, y) {
        me.code.push(me.commands.command
            + 'A3' 
            + 'H' + x.toString() 
            + 'V' + y.toString());
    };

    this.setHorizontal = function(x) {
        me.code.push(me.commands.command
            + 'H' + x.toString());
    };

    this.setVertical = function(y) {
        me.code.push(me.commands.command
            + 'V' + y.toString());
    };

    this.setPosition = function(x, y) {
        me.setHorizontal(x);
        me.setVertical(y);
    };

    this.setFont = function(font) {
        me.code.push(me.commands.command
            + font);
    };

    this.setDarkness = function(value) {
        me.code.push(me.commands.command
            + 'E' + value);
    };

    this.ExpandFont = function(x, y) {
        me.code.push(me.commands.command
            + 'L' + x + y);
    };

    this.ReverseImage = function(left, top, right, bottom) {
        me.code.push(me.commands.command
            + '(' + right.toString()
            + ',' + bottom.toString());
    };

    this.sequenceNumbering = function(repeatCount, stepSize) {
        me.code.push(me.commands.command
            + 'F' + repeatCount + stepSize);
    };

    this.setBarcodeRatio = function(sCode, sSymbol, narrowSpaceInDots, wideSpanceInDots, narrowBarInDots, wideBarInDots) { //AKA Barcode2
        //formatting needed
        me.code.push(me.commands.command
            + sCode + sSymbol
            + narrowSpaceInDots + wideSpanceInDots
            + narrowBarInDots + wideBarInDots);
    };

    this.barcode3 = function(sCode, expFactor, heightInDots) {
        me.code.push(me.commands.command
            + sCode + expFactor + heightInDots);
    };

    this.addCarriageReturn = function() {
        me.code.push('\n');
    };

    this.addText = function(x, y, font, text) {
        me.setPosition(x, y);
        me.setFont(font);
        me.code.push(text);
    };

    this.addBarcode = function(x, y, data) {
        me.setPosition(x, y);
        me.code.push(me.commands.command + 'F0001+0001' 
            + me.commands.command + 'BT101020103'
            + me.commands.command + 'BW03100*' 
            + data + '*');
    };

    this.addVerticalBarcode = function(x, y, data) {
        me.setPosition(x, y);
        me.code.push(me.commands.command + 'F0001+0001'
            + me.commands.command + 'BT101020103'
            + me.commands.command + 'BW03050*' + data + '*');
        me.setRotation(0);
    };

    this.addVectorText = function(x, y, text) {
        me.setPosition(x, y);
        me.code.push(me.commands.command + '$B,320,200,0'
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

function Font(args) {
    var me = this;
    if (!args) {
        args = {};
    }
    
    this.name = (args.name || '');
    this.dotWidth = (args.dotWidth || 0);
    this.dotHeight = (args.dogtHeight || 0);

    this.getMillimeterWidth = function(conversionFactor) {
        return (me.dotWidth / conversionFactor);
    };

    this.getMillimeterHeight = function(conversionFactor) {
        return (me.dotHeight / conversionFactor);
    };
}