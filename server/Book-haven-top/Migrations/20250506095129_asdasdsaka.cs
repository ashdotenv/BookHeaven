using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Book_haven_top.Migrations
{
    /// <inheritdoc />
    public partial class asdasdsaka : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClaimCode",
                table: "Orders",
                type: "text",
                nullable: true,
                defaultValue: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClaimCode",
                table: "Orders");
        }
    }
}
