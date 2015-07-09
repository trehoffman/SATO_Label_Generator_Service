using System;
using System.Collections.Generic;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class SatoLabel
{
    //class variables
    private String code_text = "";
    private String html = "";
    private String label_printer_path = "";
    private int dotsPerMm = 8; //for 203 dpi print heads
    //private int dotsPerMm = 12 //for 305 dpi print heads
    //private int dotsPerMm = 24 //for 609 dpi print heads
    private int[] label_size = { 4, 4 };

    //static variables
    private static String saCommand = "^";
    private static String saStartData = "{";
    private static String saEndData = "}";

    private static String saOutlineFontDesignSelection = "$";
    private static String saOutlineFontPrint = "$=";

    //position variables
    private int[] current_baseReference = {0,0};
    private int current_horizontal = 0;
    private int current_vertical = 0;

    //font variables
    private int current_darkness = 0;
    private Font current_font = new Font("",0,0);
    //private Object current_vector_font = {"", 0, 0, 0};
    private int[] current_font_expansion = {0,0};
    private int current_rotation = 0;

    //font list
    private static Font[] fonts = new Font[] {
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
    };

    //constructors
    public SatoLabel()
    {
        //nothing...
    }

	public SatoLabel(String sLabelPrinterPath)
    {
        SetLabelPrinter(sLabelPrinterPath);
	}

    //builder functions
    public String CreateSampleLabel(String sRcvBy, String sHandRef, String sAgtName, String sHawbNo, 
        String sPOD, String sConsName, String sAttn, String sAdd1, String sAdd2, String sCountry, 
        String sRoute, String sDesc, int iWrNum, int iNumPieces, int iWeight, String sSecureCode, 
        String sHazMat, float fLbsForKiloLabel, String dtDelivered, String sBoxNo, int iPieceStart, 
        int iPieceEnd)
    {
        //Boolean result = true;
        String result = "OK";
        String sAgentName_Extended = sAgtName;
        String sWrNum = iWrNum.ToString("00000000");
        String sPieceStart = iPieceStart.ToString("000");
        String barcode_data = sWrNum + sPOD + sPieceStart;
        int label_quantity = (iPieceEnd - iPieceStart) + 1;

        while (sAgentName_Extended.Length < 25) {
            sAgentName_Extended += " ";
        }

        BeginLabel();
        AddText(20, 10, "WB1", sRcvBy + " " + sAgentName_Extended + " " + sHandRef);
        ReverseImage(72, 1, 510, 39);
        AddCarriageReturn();

        AddBarcode(15, 40, barcode_data);
        AddCarriageReturn();
        AddVerticalBarcode(790, 40, barcode_data);
        AddCarriageReturn();

        AddOutlineFontDesignText(92, 125, "B", 320, 200, 0, sPOD);
        AddCarriageReturn();
        ReverseImage(15, 145, 675, 150);
        AddCarriageReturn();

        AddText(425, 350, "M", "AWB #");
        AddText(425, 375, "WL1", iWrNum.ToString());

        AddText(15, 300, "XB1", sConsName);
        AddText(15, 350, "XB1", "(" + sBoxNo + ")");
        AddText(15, 400, "M", "ROUTE: " + sRoute);
        AddText(15, 450, "M", sAttn);
        AddText(15, 475, "M", sAdd1);
        AddText(15, 500, "M", sAdd2);
        AddText(15, 525, "M", sCountry);
        AddText(15, 560, "M", "Description:");
        AddText(15, 585, "XB1", sDesc);
        AddText(50, 685, "M", dtDelivered);

        AddPiecesLine(50, 735, sPieceStart, iNumPieces, iWeight, sSecureCode);
        AddCarriageReturn();

        if (fLbsForKiloLabel > 0) {
            AddText(50, 490, "M", fLbsForKiloLabel.ToString() + " LBS");
        }

        if (sHazMat.Length > 0) {
            AddText(700, 350, "WL1", sHazMat);
            ReverseImage(645, 315, 120, 120);
        }

        SetLabelQuantity(label_quantity);
        EndLabel();

        //result = PrintLabel();
        result = html;

        return result;
    }

    public String CreateSampleLabel0(String sBaggerName, String sPOD, String LoadList, String Date, int BagCount, int BoxCount, int FirstLabel, int LastLabel)
    {
        String result = "OK";
        int TotalCount = BagCount + BoxCount;
        int iPieceStart = 1;

        BeginLabel();
        AddText(425, 10, "WB1", sBaggerName);
        //ReverseImage(72, 1, 510, 39);
        //AddCarriageReturn();

        AddOutlineFontDesignText(92, 125, "B", 320, 200, 0, sPOD);
        AddCarriageReturn();
        ReverseImage(15, 145, 675, 150);
        AddCarriageReturn();

        AddText(15, 300, "XB1", LoadList);
        AddText(15, 350, "XB1", Date);
        /*
        AddText(15, 400, "M", "ROUTE: " + sRoute);
        AddText(15, 450, "M", sAttn);
        AddText(15, 475, "M", sAdd1);
        AddText(15, 500, "M", sAdd2);
        AddText(15, 525, "M", sCountry);
        AddText(15, 560, "M", "Description:");
        AddText(15, 585, "XB1", sDesc);
        AddText(50, 685, "M", dtDelivered);
        */

        AddText(425, 350, "XB1", "# of Bags: " + BagCount.ToString());
        AddText(425, 400, "XB1", "# of Boxes: " + BoxCount.ToString());
        AddText(425, 450, "XB1", "Total: " + TotalCount.ToString());

        SetPosition(50, 735);
        code_text += saCommand + "F0001+0001";
        code_text += saCommand + "L0102";
        code_text += saCommand + "M" + iPieceStart.ToString();
        code_text += saCommand + "L0101";
        code_text += saCommand + "M" + " PC OF ";
        code_text += saCommand + "WL1" + TotalCount.ToString();
        AddCarriageReturn();

        SetLabelQuantity(TotalCount);
        EndLabel();

        //result = PrintLabel();
        result = html;

        return result;
    }

    public String CreateSampleLabel1(int iNumPieces, int iPieceStart, int iPieceEnd)
    {
        String result = "OK";
        String timeStamp = DateTime.Now.ToString();
        int TotalCount = iPieceEnd-iPieceStart;

        BeginLabel();
        AddText(425, 10, "WB1", "Sample Label 1");

        AddOutlineFontDesignText(92, 125, "B", 320, 200, 0, "SATO");
        ReverseImage(15, 145, 675, 150);

        AddText(15, 350, "XB1", timeStamp);

        AddText(425, 350, "XB1", "# Pieces: " + iNumPieces.ToString());
        SetVertical(400);
        SetText("# To Print: " + TotalCount.ToString());
        SetVertical(450);
        SetText("Fuck youuuuuuu");

        //BT101020103^BW03100
        SetPosition(15, 500);
        SetBarcodeRatioRegistration("1", 01, 02, 01, 03);
        SetBarcodeRatioOneToThree("W", 03, 100, "bullshit");

        SetLabelQuantity(TotalCount);
        EndLabel();

        //result = PrintLabel();
        result = html;

        return result;
    }

    //helper functions
    public String ReturnLabel()
    {
        return code_text;
    }

    public String ReturnLabelHtml()
    {
        return html;
    }

    public void SetLabelPrinter(String sLabelPrinterPath) {
        label_printer_path = sLabelPrinterPath;
    }

    public String PrintLabel()
    {
        //Boolean result = true;
        String result = "OK";
        FileOperations fo = new FileOperations();
        result = fo.CopyDataToLocation(code_text, label_printer_path);

        return result;
    }

    //label code manipulation functions
    public void InitializeLabel()
    {
        code_text += "";
        html = "";
    }

    public void BeginLabel() {
        code_text += saStartData + saCommand + "A";
        html += "<div class='four-by-four'>";
    }

    public void EndLabel() {
        code_text += saCommand + "Z" + saEndData;
        html += "</div>";
    }

    public void SetLabelQuantity(int quantity)
    {
        code_text += saCommand + "Q" + quantity;
    }

    public void SetRotation(int value)
    {
        code_text += saCommand + "%" + value.ToString();
        current_rotation = value;
    }

    public void SetBaseReference(int x, int y)
    {
        code_text += saCommand + "A3" + "H" + x.ToString() + "V" + y.ToString();
        current_baseReference[0] = x;
        current_baseReference[1] = y;
    }

    public void SetHorizontal(int x)
    {
        code_text += saCommand + "H" + x.ToString();
        current_horizontal = x;
    }

    public void SetVertical(int y)
    {
        code_text += saCommand + "V" + y.ToString();
        current_vertical = y;
    }

    public void SetPosition(int x, int y)
    {
        SetHorizontal(x);
        current_horizontal = x;
        SetVertical(y);
        current_vertical = y;
    }

    public void SetFont(String font) {
    	if (font.Length > 0)
    	{
            code_text += saCommand + font;
            foreach (Font f in fonts)
            {
                if (font == f.GetName())
                {
                    current_font = f;
                }
            }
    	}
    }

    public void SetText(String text)
    {
        code_text += text;

        float xMm = current_horizontal / dotsPerMm;
        float yMm = current_vertical / dotsPerMm;

        html += "<div style='position:absolute; left:" + xMm + "mm; top:" + yMm + "mm; height: " + current_font.GetMillimeterHeight(dotsPerMm) + "mm;'>"
        + text
        + "</div>";
    }

    public void SetDarkness(int value)
    {
        code_text += saCommand + "E" + value;
        current_darkness = value;
    }

    public void ExpandFont(int x, int y)
    {
        code_text += saCommand + "L" + x.ToString("D2") + y.ToString("D2");
        current_font_expansion[0] = x;
        current_font_expansion[1] = y;
    }

    public void AddOutlineFontDesignText(int x, int y, String fontType, int fontWidth, int fontHeight, int fontDesign, String text)
    {
        float xMm = x / dotsPerMm;
        float yMm = y / dotsPerMm;
        float fontWidthMm = fontWidth / dotsPerMm;
        float fontHeightMm = fontHeight / dotsPerMm;

        /*Outline Font Design page 74*/
        SetPosition(x, y);
        code_text += saCommand + saOutlineFontDesignSelection
            + fontType + ","
            + fontWidth + ","
            + fontHeight + ","
            + fontDesign;
        code_text += saCommand + saOutlineFontPrint + text;

        //float textWidthMm = fontHeightMm * text.Length;

        html += "<div style='position:absolute; top:" + yMm + "mm; left:" + xMm + "mm; height:" + fontHeightMm + "mm;'>" //width:" + textWidthMm + "mm;
            + text
            + "</div>";
    }

    public void ReverseImage(int left, int top, int right, int bottom)
    {
        float xMm = left / dotsPerMm;
        float yMm = top / dotsPerMm;
        float widthMm = right / dotsPerMm;
        float heightMm = bottom / dotsPerMm;

        /* Reverse Color Print page 29*/
        SetPosition(left, top);
        code_text += saCommand + "(" + right.ToString() + "," + bottom.ToString();

        html += "<div style='position:absolute; background-color:rgba(0,0,0,.5); left:" + xMm + "mm; top:" + yMm + "mm; width:" + widthMm + "mm; height:" + heightMm + "mm;'>"
            + "</div>";
    }

    public void SequenceNumbering(int RepeatCount, int StepSize)
    {
        code_text += saCommand + "F" + RepeatCount.ToString("D4") + StepSize.ToString("D4");
    }

    public void SetBarcodeRatioRegistration(String barcodeType, int narrowSpace, int wideSpace, int narrowBar, int wideBar)
    {
        /*Barcode Ratio Registration page 128*/
        code_text += saCommand + "BT"
            + barcodeType
            + narrowSpace.ToString("D2")
            + wideSpace.ToString("D2")
            + narrowBar.ToString("D2")
            + wideBar.ToString("D2");
    }

    public void SetBarcodeRatioOneToThree(String barcodeType, int narrowBarWidth, int barcodeHeight, String data) {
        /*Barcode Ratio 1:3*/
        code_text += saCommand + "B"
            + barcodeType
            + narrowBarWidth.ToString("D2")
            + barcodeHeight.ToString("D3") 
            + "*" + data + "*";

        float xMm = current_horizontal / dotsPerMm;
        float yMm = current_vertical / dotsPerMm;

        html += "<div style='position:absolute; left:" + xMm + "mm; top:" + yMm + "mm;'>*" + data + "*</div>";
    }

    public void Barcode3(String sCode, int expFactor, int heightInDots)
    {
        //formatting needed...
        code_text += saCommand + sCode + expFactor + heightInDots;
    }

    //aesthetic functions
    public void AddCarriageReturn()
    {
        code_text += "\n";
    }

    //futher manipulation functions
    public void AddText(int x, int y, String font, String text)
    {
        SetPosition(x, y);
        SetFont(font);
        SetText(text);
    }

    public void AddBarcode(int x, int y, String data)
    {
        SetPosition(x, y);
        code_text += "^F0001+0001^BT101020103^BW03100*" + data + "*";
    }

    public void AddVerticalBarcode(int x, int y, String data)
    {
        SetRotation(3);
        SetPosition(x, y);
        code_text += "^F0001+0001^BT101020103^BW03050*" + data + "*";
        SetRotation(0);
    }

    public void AddPiecesLine(int x, int y, String sPieceNum, int iNumPieces, int iWeight, String sSecureCode)
    {
        SetPosition(x, y);
        code_text += saCommand + "F0001+0001";
        code_text += saCommand + "L0102";
        code_text += saCommand + "M" + sPieceNum;
        code_text += saCommand + "L0101";
        code_text += saCommand + "M" + " PC OF ";
        code_text += saCommand + "WL1" + iNumPieces.ToString();
        code_text += saCommand + "WL1" + "   " + iWeight.ToString();
        code_text += saCommand + "M" + " LBS TOTAL";
        if (sSecureCode.Length > 0) {
            code_text += saCommand + "WL1" + "   " + sSecureCode;
            ReverseImage(570, 690, 140, 100);
        }
    }
}
