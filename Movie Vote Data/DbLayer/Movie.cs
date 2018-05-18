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
        [Display(Name = "��'�")]
        public string Name { get; set; }

        [Display(Name = "г�")]
        public short? Year { get; set; }

        [Display(Name = "�������")]
        public short Rate { get; set; }

        [Display(Name = "�����?")]
        public bool IsTvShow { get; set; }

        [Display(Name = "���������?")]
        public bool IsFavorite { get; set; }
    }
}
