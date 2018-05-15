namespace Movie_Vote_Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nullableyear : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Movie", "Year", c => c.Short());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Movie", "Year", c => c.Short(nullable: false));
        }
    }
}
