using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using System.Web.Http.Routing;

namespace Movie_Vote.Helpers
{
    public static class UrlHelperExtensions
    {
        public static string GetImage(this UrlHelper helper,
            string imageFileName,
            bool localizable = true)
        {
            string strUrlPath, strFilePath = string.Empty;
            if (localizable)
            {
                /* Look for current culture */
                strUrlPath = string.Format("/Content/Images/{0}/{1}",
                    GlobalHelper.CurrentCulture,
                    imageFileName);
                strFilePath = HttpContext.Current.Server.MapPath(strUrlPath);
                if (!File.Exists(strFilePath))
                {   /* Look for default culture  */
                    strUrlPath = string.Format("/Content/{0}/Images/{1}",
                    GlobalHelper.DefaultCulture,
                    imageFileName);
                }
                return strUrlPath;
            }

            strUrlPath = string.Format("/Content/Images/{0}", imageFileName);
            strFilePath = HttpContext.Current.Server.MapPath(strUrlPath);
            if (File.Exists(strFilePath))
            {   /* Look for resources in general folder as last option */
                return strUrlPath;
            }

            return strUrlPath;
        }
    }
}