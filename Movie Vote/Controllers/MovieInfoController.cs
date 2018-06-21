using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Movie_Vote_Data.DbLayer;
using RestSharp;
using Newtonsoft.Json.Linq;
using System.Configuration;
using System.Dynamic;
using System.Web;

namespace Movie_Vote.Controllers
{
    public class MovieInfoController : ApiController
    {
        private MovieContext db = new MovieContext();
        private readonly string key = ConfigurationManager.AppSettings["TMDBAPIKey"];

        [Route("api/MovieInfo/Genres")]
        public JObject GetGenres()
        {
            string locale = BaseController.GetCultureOnCookie(new HttpRequestWrapper(HttpContext.Current.Request));

            //movie
            var clientMovie = new RestClient($"https://api.themoviedb.org/3/genre/movie/list?language={locale}&api_key={key}");
            var requestMovie = new RestRequest(Method.GET);
            IRestResponse responseMovie = clientMovie.Execute(requestMovie);
            JObject resultMovie = JObject.Parse(responseMovie.Content.Replace("genres", "genresMovie"));

            //tv
            var clientTv = new RestClient($"https://api.themoviedb.org/3/genre/tv/list?language={locale}&api_key={key}");
            var requestTv = new RestRequest(Method.GET);
            IRestResponse responseTv = clientTv.Execute(requestTv);
            JObject resultTv = JObject.Parse(responseTv.Content.Replace("genres", "genresTv"));

            return MergeJsonObjects(resultMovie, resultTv);
        }

        // GET: api/MovieInfo/5
        [Route("api/MovieInfo/Movie/{id}")]
        public JObject GetMovie(short id)
        {
            var data = db.Movies.Find(id);

            return MovieData(data);
        }

        JObject MovieData(Movie data)
        {
            string[] locale = new string[] { "uk-UA", "ru-RU", "en-US" };

            var client = new RestClient("https://api.themoviedb.org");
            var request = new RestRequest("3/search/{type}", Method.GET);
            request.AddUrlSegment("type", data.IsTvShow?"tv":"movie");
            request.AddParameter("page", 1);
            request.AddParameter("query", data.Name);
            request.AddParameter("api_key", key);
            if (data.Year != null)
            {
                if (data.IsTvShow)
                    request.AddParameter("first_air_date_year", data.Year);
                else
                    request.AddParameter("year", data.Year);
            }

            JObject json = null;
            foreach (var lang in locale)
            {
                request.AddParameter("language", lang);
                json = JObject.Parse(client.Execute(request).Content);
                if (json["total_results"] == null)
                    return json;
                if (json["total_results"].Value<int>() > 0 && json["results"][0]["overview"].Value<string>() != "")
                    return json;
            }

            return json;
        }

        JObject MergeJsonObjects(params JObject[] objects)
        {
            JObject json = new JObject();
            foreach (JObject JSONObject in objects)
            {
                foreach (var property in JSONObject)
                {
                    string name = property.Key;
                    JToken value = property.Value;

                    json.Add(name, value);
                }
            }

            return json;
        }
    }
}