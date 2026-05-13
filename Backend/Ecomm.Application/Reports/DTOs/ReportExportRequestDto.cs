namespace Ecomm.Application.Reports.DTOs;

public class ReportExportRequestDto
{
    public string Format { get; set; } = "xlsx";
    public ReportFilterDto Filters { get; set; } = new();
}