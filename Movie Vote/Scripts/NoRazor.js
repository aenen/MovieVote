﻿function GetId(element) {
  return $(element).closest(".panel-movie").attr("data-id");
}


var URL = "https://movievote.azurewebsites.net/";//"http://localhost:7475/";//
var culture = MultiLanguage.Cookies.getCookie("LangForMultiLanguage");

var movieInfo = function (panel) {
  if (!$(panel).hasClass("no-init"))
    return false;

  var id = GetId(panel);
  $.getJSON(URL + 'api/MovieInfo/Movie/' + id, function (data) {
    initMovie[$(panel).attr("data-type")].call(panel, data);
    $(panel).removeClass("no-init");
  }).fail(function () {
    $(panel).find(".movie-poster").attr("src", "/Content/Images/" + culture + "/noposter.png");
  });
};
//geting genres
var genres = {
  movie: [],
  tv: []
};
$.getJSON(URL + 'api/MovieInfo/Genres', function (data) {
  genres.movie = data.genresMovie;
  genres.tv = data.genresTv;
  // додаю данні про фільми тут. знаю, що тупо, але по іншому не знаю як
  $(".panel-movie").each(function (index, element) {
    movieInfo(this);
  });
}).fail(function () {
  $(".panel-movie").each(function (index, element) {
    movieInfo(this);
  });
});

//geting info
var initMovie = {
  "tv": function (data) {
    if (data.total_results > 0) {
      var result = data.results[0];
      if (result.poster_path != null && result.poster_path != "")
        $(this).find(".movie-poster").attr("src", "https://image.tmdb.org/t/p/w300" + result.poster_path);
      else
        $(this).find(".movie-poster").attr("src", "/Content/Images/" + culture + "/noposter.png");
      $(this).find(".movie-name").text(result.original_name);
      $(this).find(".movie-release").text(result.first_air_date);
      if (result.overview) {
        $(this).find(".description-wrapper").show().find(".movie-description").text(result.overview);
      }
      var genreStr = "";
      for (var i in result.genre_ids) {
        for (var j in genres.tv) {
          if (result.genre_ids[i] == genres.tv[j].id) {
            genreStr += genres.tv[j].name + ", ";
            break;
          }
        }
      }
      if (genreStr !== "") genreStr = genreStr.slice(0, -2);
      $(this).find(".movie-genre").text(genreStr);      
    }
    else {
      $(this).find(".movie-poster").attr("src", "/Content/Images/" + culture + "/noposter.png");
    }
  },
  "movie": function (data) {
    if (data.total_results > 0) {
      var result = data.results[0];
      if (result.poster_path != null && result.poster_path != "")
        $(this).find(".movie-poster").attr("src", "https://image.tmdb.org/t/p/w300" + result.poster_path);
      else
        $(this).find(".movie-poster").attr("src", "/Content/Images/" + culture + "/noposter.png");
      $(this).find(".movie-name").text(result.original_title);
      $(this).find(".movie-release").text(result.release_date);
      if (result.overview) {
        $(this).find(".description-wrapper").show().find(".movie-description").text(result.overview);
      }
      var genreStr = "";
      for (var i in result.genre_ids) {
        for (var j in genres.movie) {
          if (result.genre_ids[i] == genres.movie[j].id) {
            genreStr += genres.movie[j].name + ", ";
            break;
          }
        }
      }
      if (genreStr !== "") genreStr = genreStr.slice(0, -2);
      $(this).find(".movie-genre").text(genreStr);
    }
    else {
      $(this).find(".movie-poster").attr("src", "/Content/Images/" + culture + "/noposter.png");
    }
  }
};