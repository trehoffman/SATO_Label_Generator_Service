using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    [WebMethod]
    public static DataHolder CreateSatoLabel(int iNumPieces, int iPieceStart, int iPieceEnd, String sLabelPrinterPath)
    {
        System.Diagnostics.Debug.WriteLine("CreateSatoLabel");
        DataHolder dh = new DataHolder();

        try
        {
            SatoLabel label = new SatoLabel(sLabelPrinterPath);
            dh.Result = label.CreateSampleLabel1(iNumPieces, iPieceStart, iPieceEnd);
            dh.Data = label.ReturnLabelHtml();
        }
        catch (Exception e)
        {
            dh.Result = e.ToString();
        }

        return dh;
    }

    public class DataHolder
    {
        public String Result = "OK";
        public String Data;
    }
}