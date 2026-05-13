namespace Ecomm.Application.Reports.DTOs;

public record ReportFileResultDto(string FileName, string ContentType, byte[] Content);