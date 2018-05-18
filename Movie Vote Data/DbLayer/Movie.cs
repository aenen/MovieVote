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
        [Display(Name = "Ім'я")]
        public string Name { get; set; }

        [Display(Name = "Рік")]
        public short? Year { get; set; }

        [Display(Name = "Рейтинг")]
        public short Rate { get; set; }

        [Display(Name = "Серіал?")]
        public bool IsTvShow { get; set; }

        [Display(Name = "Улюблений?")]
        public bool IsFavorite { get; set; }
    }
}
