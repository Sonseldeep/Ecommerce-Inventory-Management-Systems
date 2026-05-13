namespace Ecomm.Application.Reports.DTOs;

public class ReportFilterDto
{
    public DateTime? FromUtc { get; set; }
    public DateTime? ToUtc { get; set; }
    public string? CategoryName { get; set; }
    public bool? IsActive { get; set; }
    public int? Top { get; set; }
}