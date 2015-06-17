using System;
using System.Collections.Generic;
using System.Web;

/// <summary>
/// Summary description for FileOperations
/// </summary>
public class FileOperations
{
	public FileOperations()
	{
		//
		// TODO: Add constructor logic here
		//
	}

    public String CopyDataToLocation(String sData, String sCopyToLocation)
    {
        String result = "OK";
        try
        {
            String sCopyToPath = sCopyToLocation;
            String sCopyToFileName = System.IO.Path.GetFileName(sCopyToLocation);
            String sTempFileName = Guid.NewGuid().ToString();
            String sCopyToDirectory = sCopyToLocation.Substring(0, sCopyToLocation.LastIndexOf(sCopyToFileName));

            //get temporary path
            String tempPath = System.IO.Path.GetTempPath() + sTempFileName;

            //if no filename is given, then use temp filename
            if (sCopyToFileName.Length == 0)
            {
                sCopyToPath = System.IO.Path.Combine(sCopyToLocation, sTempFileName);
            }

            //write data to temporary file
            System.IO.File.WriteAllText(tempPath, sData);

            //copy data to final destination
            System.IO.File.Copy(tempPath, sCopyToPath, true);

            //delete temporary file
            System.IO.File.Delete(tempPath);

            //return tempPath + " ==> " + sCopyToPath;
            result = "OK";
        }
        catch (Exception e)
        {
            //return "Error: " + e.ToString();
            result = "ERROR: " + e.ToString();
        }
        return result;
    }

    public String CopyFileToLocation(String sCopyFromLocation, String sCopyToLocation)
    {
        String result = "OK";
        try
        {
            //check that "copy from" location exists
            if (System.IO.File.Exists(sCopyFromLocation))
            {
                String sCopyToPath = sCopyToLocation;
                String sCopyFromFileName = System.IO.Path.GetFileName(sCopyFromLocation);
                String sCopyToFileName = System.IO.Path.GetFileName(sCopyToLocation);

                //if no filename is in "copy to" location then add it
                if (sCopyToFileName.Length == 0)
                {
                    sCopyToPath = System.IO.Path.Combine(sCopyToLocation, sCopyFromFileName);
                }

                //copy data to final destination
                System.IO.File.Copy(sCopyFromLocation, sCopyToPath, true);

                //return sCopyFromLocation + " ==> " + sCopyToPath;
                //return true;
                result = "OK";
            }
            else
            {
                //return sCopyFromLocation + " does not exist";
                //return false;
                result = sCopyFromLocation + " does not exist";
            }
        }
        catch (Exception e)
        {
            //return "Error: " + e.ToString();
            //return false;
            result = "ERROR: " + e.ToString();
        }
        return result;
    }
}