namespace Movie_Vote_Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsFavorite : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Movie", "IsFavorite", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Movie", "IsFavorite");
        }
    }
}
