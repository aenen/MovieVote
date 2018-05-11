using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Movie_Vote.Controllers
{
    public class AdminController : Controller
    {
        private readonly string _login = ConfigurationManager.AppSettings["AdminLogin"];
        private readonly string _pass = ConfigurationManager.AppSettings["AdminPassword"];

        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(string login, string password)
        {
            if (login == _login && _pass == password)
                FormsAuthentication.RedirectFromLoginPage(_login, true);
            return View();
        }

        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home");
        }
    }
}