﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Movie_Vote_Data.DbLayer;
using Movie_Vote.Helpers;

namespace Movie_Vote.Controllers
{
    public class MovieController : Controller
    {
        readonly MovieContext db = new MovieContext();
        const int movies = 44;

        // GET: Movie
        [Authorize]
        public ActionResult Index(int page = 1, string filterName = "Id", bool isFilterAscending = false)
        {            
            IEnumerable<Movie> result = db.Movies.OrderByProperty(filterName, isFilterAscending);

            int count = result.Count();
            int pages = count / movies + ((count % movies == 0) ? 0 : 1);

            ViewBag.Pages = pages;
            ViewBag.Page = page;
            ViewBag.FilterName = filterName;
            ViewBag.IsFilterAscending = isFilterAscending;

            result = result.Skip((page - 1) * movies).Take(movies).ToList();
            return View(result);
        }

        // GET: Movie/Create
        [Authorize]
        public ActionResult Create()
        {
            return View();
        }

        // POST: Movie/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public ActionResult Create([Bind(Include = "Name,Year,IsTvShow,IsFavorite")] Movie movie)
        {
            if (ModelState.IsValid)
            {
                movie.Watched = DateTime.Now;
                db.Movies.Add(movie);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(movie);
        }

        // GET: Movie/Edit/5
        [Authorize]
        public ActionResult Edit(short? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Movie movie = db.Movies.Find(id);
            if (movie == null)
            {
                return HttpNotFound();
            }
            return View(movie);
        }

        // POST: Movie/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public ActionResult Edit([Bind(Include = "Id,Name,Year,IsTvShow,IsFavorite")] Movie movie)
        {
            if (ModelState.IsValid)
            {
                db.Entry(movie).State = EntityState.Modified;
                db.Entry(movie).Property(p => p.Rate).IsModified = false;
                db.Entry(movie).Property(p => p.Watched).IsModified = false;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(movie);
        }

        // GET: Movie/Delete/5
        [Authorize]
        public ActionResult Delete(short? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Movie movie = db.Movies.Find(id);
            if (movie == null)
            {
                return HttpNotFound();
            }
            return View(movie);
        }

        // POST: Movie/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Authorize]
        public ActionResult DeleteConfirmed(short id)
        {
            Movie movie = db.Movies.Find(id);
            db.Movies.Remove(movie);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
