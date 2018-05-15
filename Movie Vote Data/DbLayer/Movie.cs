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
        public short Id { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public short? Year { get; set; }

        public short Rate { get; set; }

        [StringLength(50)]
        public string Extras { get; set; }

        public bool IsFavorite { get; set; }
    }
}
