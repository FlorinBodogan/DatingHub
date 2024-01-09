using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BACKEND.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLikeDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LikedEachOtherDate",
                table: "Likes",
                newName: "LikeDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LikeDate",
                table: "Likes",
                newName: "LikedEachOtherDate");
        }
    }
}
