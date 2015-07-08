using System;
using System.Collections.Generic;
using System.Web;

/// <summary>
/// Summary description for Font
/// </summary>
public class Font
{
    String Name;
    int dotWidth;
    int dotHeight;

	public Font()
	{
		//
		// TODO: Add constructor logic here
		//
	}

    public Font(String name, int dot_width, int dot_height)
    {
        this.Name = name;
        this.dotWidth = dot_width;
        this.dotHeight = dot_height;
    }

    public String GetName() {
        return Name;
    }

    public int GetDotWidth()
    {
        return dotWidth;
    }

    public int GetDotHeight()
    {
        return dotHeight;
    }

    public float GetMillimeterWidth(int ConversionFactor)
    {
        return dotWidth / ConversionFactor;
    }

    public float GetMillimeterHeight(int ConversionFactor)
    {
        return dotHeight / ConversionFactor;
    }
}