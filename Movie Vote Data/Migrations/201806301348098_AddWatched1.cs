namespace Movie_Vote_Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddWatched1 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Movie", "Watched", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Movie", "Watched", c => c.DateTime(nullable: false));
        }
    }
}
