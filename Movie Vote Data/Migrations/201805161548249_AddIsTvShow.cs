namespace Movie_Vote_Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsTvShow : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Movie", "IsTvShow", c => c.Boolean(nullable: false));
            Sql("UPDATE dbo.Movie SET IsTvShow = 1 WHERE Extras = 'tv'");
        }

        public override void Down()
        {
            DropColumn("dbo.Movie", "IsTvShow");
        }
    }
}
