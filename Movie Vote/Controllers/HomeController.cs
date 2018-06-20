using Movie_Vote_Data.BusinessLayer;
using Movie_Vote_Data.DbLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Movie_Vote.Controllers
{
    public class HomeController : BaseController
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

        public ActionResult Page(int page = 1, string date = "new", string type = "all", string rate = "all", bool favorite = false, bool my_heart = false)
        {
            var result = context.Movies.AsEnumerable();
            switch (date)
            {
                case "new":
                    result = result.OrderByDescending(x => x.Id);
                    break;
                case "old":
                    result = result.OrderBy(x => x.Id);
                    break;
                default:
                    break;
            }

            switch (type)
            {
                case "all":
                    break;
                case "movie":
                    result = result.Where(x=>!x.IsTvShow);
                    break;
                case "tv":
                    result = result.Where(x => x.IsTvShow);
                    break;
                default:
                    break;
            }

            switch (rate)
            {
                case "all":
                    break;
                case "hight":
                    result = result.OrderByDescending(x=>x.Rate);
                    break;
                case "low":
                    result = result.OrderBy(x => x.Rate);
                    break;
                default:
                    break;
            }

            if (favorite)
                result = result.Where(x => x.IsFavorite);
            if(my_heart)
            {
                UserVote uv = Session["UserVote"] as UserVote;
                result=result.Join(uv.MovieId, x => x.Id, x => x, (a, b) => new { XMovie = a }).Select(x => x.XMovie).ToList();
            }

            int count = result.Count();
            int pages = count / movies + ((count % movies == 0) ? 0 : 1);
            ViewBag.Pages = pages;

            result = result.Skip((page - 1) * movies).Take(movies).ToList();
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
                rate = ++context.Movies.Find(id).Rate;
            }

            context.SaveChanges();
            return Json(rate);
        }

    }
}