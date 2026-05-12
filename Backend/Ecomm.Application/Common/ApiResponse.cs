namespace Ecomm.Application.Common;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Success")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message, 
            Data = data
        };
    }

    public static ApiResponse<T> Fail(string message)
    {
        return new ApiResponse<T>
        {
            Success = false, 
            Message = message
        };
    }
    public static ApiResponse<T> PartialSuccess<T> (T data, string message = "Partial Success")
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message, 
            Data = data
        };
    }
}