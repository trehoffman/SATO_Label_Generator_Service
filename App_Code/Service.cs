using System;
using System.Collections.Generic;
//using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
//using System.ServiceModel.Web;
using System.Text;

[ServiceContract(Namespace = "")]
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
public class Service
{
	// To use HTTP GET, add [WebGet] attribute. (Default ResponseFormat is WebMessageFormat.Json)
	// To create an operation that returns XML,
	//     add [WebGet(ResponseFormat=WebMessageFormat.Xml)],
	//     and include the following line in the operation body:
	//         WebOperationContext.Current.OutgoingResponse.ContentType = "text/xml";
	[OperationContract]
	public void DoWork()
	{
		// Add your operation implementation here
		return;
	}

	// Add more operations here and mark them with [OperationContract]
    [OperationContract]
    public string CreateSatoLabel(int iNumPieces, int iPieceStart, int iPieceEnd, String sLabelPrinterPath)
    {
        string result = "OK";

        try
        {
            SatoLabel label = new SatoLabel(sLabelPrinterPath);
            result = label.CreateSampleLabel1(iNumPieces, iPieceStart, iPieceEnd);
        }
        catch (Exception e)
        {
            result = "Error: " + e.ToString();
        }

        return result;
    }
}
