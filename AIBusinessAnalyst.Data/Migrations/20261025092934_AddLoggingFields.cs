using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AIBusinessAnalyst.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLoggingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "ExecutionTimeMs",
                table: "QueryHistories",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "GlossaryTermCount",
                table: "QueryHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "GlossaryUsed",
                table: "QueryHistories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SchemaContext",
                table: "QueryHistories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExecutionTimeMs",
                table: "QueryHistories");

            migrationBuilder.DropColumn(
                name: "GlossaryTermCount",
                table: "QueryHistories");

            migrationBuilder.DropColumn(
                name: "GlossaryUsed",
                table: "QueryHistories");

            migrationBuilder.DropColumn(
                name: "SchemaContext",
                table: "QueryHistories");
        }
    }
}
