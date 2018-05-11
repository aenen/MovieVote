using Movie_Vote_Data.BusinessLayer;
using Movie_Vote_Data.DbLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Movie_Vote.Controllers
{
    public class HomeController : Controller
    {
        MovieContext context = new MovieContext();
        UserVote uv;
        const int movies = 12;

        // GET: Home
        public ActionResult Index()
        {
            int count = context.Movies.Count();
            int pages = count / movies + ((count % movies == 0) ? 0 : 1);

            ViewBag.Pages = pages;

            uv = Session["UserVote"] == null ? new UserVote(Session.SessionID) : (UserVote)Session["UserVote"];
            Session["UserVote"] = uv;
            return View(context.Movies.OrderByDescending(o => o.Id).Take(movies));
        }

        public ActionResult Page(int page=1)
        {
            var result = context.Movies.OrderByDescending(o => o.Id).Skip((page - 1) * movies).Take(movies).ToList();
            return PartialView(result);
        }

        [HttpPost]
        public ActionResult Vote(int id)
        {
            UserVote uv = Session["UserVote"] as UserVote;
            short rate = 0;

            if (uv.MovieId.Contains(id))
            {
                uv.MovieId.Remove(id);
                rate = --context.Movies.Find(id).Rate;
            }
            else
            {
                uv.MovieId.Add(id);
                rate = ++context.Movies.Find(id).Rate; //геніальні конструкції
            }

            context.SaveChanges();
            return Json(rate);
        }

    }
}