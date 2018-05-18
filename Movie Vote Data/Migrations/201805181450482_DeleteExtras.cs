namespace Movie_Vote_Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DeleteExtras : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Movie", "Extras");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Movie", "Extras", c => c.String(maxLength: 50));
        }
    }
}
