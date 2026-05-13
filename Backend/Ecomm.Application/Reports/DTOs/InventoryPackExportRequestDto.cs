namespace Ecomm.Application.Reports.DTOs;


public class InventoryPackExportRequestDto
{
    public string Format { get; set; } = "xlsx"; // only xlsx for pack
    public ReportFilterDto Filters { get; set; } = new();
}