namespace Movie_Vote_Data.DbLayer
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Movie")]
    public partial class Movie
    {
        [Display(Name = "ID")]
        public short Id { get; set; }

        [StringLength(50)]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Display(Name = "Year")]
        public short? Year { get; set; }

        [Display(Name = "Rate")]
        public short Rate { get; set; }

        [Display(Name = "TV show")]
        public bool IsTvShow { get; set; }

        [Display(Name = "Favorite")]
        public bool IsFavorite { get; set; }
    }
}
