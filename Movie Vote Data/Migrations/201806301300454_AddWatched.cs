namespace Movie_Vote_Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddWatched : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Movie", "Watched", c => c.DateTime(nullable: true));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Movie", "Watched");
        }
    }
}
