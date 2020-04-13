function SatoLabelPrinterEmulator() {
    var me = this;

    me.init = function() {
        me.satoPrinter = new SatoPrinter();
        me.satoLabel = new SatoLabel();
        me.addEventListeners();
    };

    me.addEventListeners = function() {
        document.addEventListener('change', me.onChangeHandler);
        document.addEventListener('click', me.onClickHandler);
        document.addEventListener('keyup', me.onKeyUpHandler);
    };

    me.onChangeHandler = async function(e) {
        if (e.target.name === 'mode') {
            let mode = e.target.value;
            me.satoPrinter.setCodeType(mode);
            me.satoLabel.setCodeType(mode);
        }

        await timeout(250);
        me.refreshLabels();
    };
    
    me.onClickHandler = async function(e) {
        if (e.target.classList.contains('addText')) {
            var x = document.querySelector('.horizontal-position').value.trim();
            var y = document.querySelector('.vertical-position').value.trim();
            var font = document.querySelector('.font').value.trim().toUpperCase();
            var text = document.querySelector('.text').value.trim();
            me.satoLabel.addText(x, y, font, text);
        }

        if (e.target.classList.contains('helloworld')) {
            me.satoLabel.helloWorld();
        }

        if (e.target.classList.contains('initialize')) {
            me.satoLabel.initialize();
        }

        if (e.target.classList.contains('startlabel')) {
            me.satoLabel.startLabel();
        }

        if (e.target.classList.contains('endlabel')) {
            me.satoLabel.endLabel();
        }

        await timeout(250);
        me.refreshEditor();
        me.refreshLabels();
    };

    me.onKeyUpHandler = async function(e) {
        if (e.target.classList.contains('display')) {
            me.satoLabel.code = e.target.value;
        }

        await timeout(250);
        me.refreshLabels();
    };

    me.refreshEditor = function() {
        document.querySelector('.display').value = me.satoLabel.text();
    };

    me.refreshLabels = function() {
        document.querySelector('.labels').innerHTML = me.satoPrinter.html(me.satoLabel.text());
        var scripts = document.querySelector('.labels').getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            eval(script.text);
        }
    };

    me.evaluateScripts = function() {
        
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    me.init();
}
var satoLabelPrinterEmulator = new SatoLabelPrinterEmulator();