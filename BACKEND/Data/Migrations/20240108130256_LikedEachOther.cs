using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BACKEND.Data.Migrations
{
    /// <inheritdoc />
    public partial class LikedEachOther : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "LikedEachOther",
                table: "Likes",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LikedEachOther",
                table: "Likes");
        }
    }
}
