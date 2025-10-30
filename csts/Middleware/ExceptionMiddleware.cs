using System.Net;
using System.Text.Json;
using Serilog;

namespace csts.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var statusCode = ex switch
                {
                    UnauthorizedAccessException => HttpStatusCode.Unauthorized,   // 401
                    KeyNotFoundException => HttpStatusCode.NotFound,              // 404
                    ArgumentException => HttpStatusCode.BadRequest,               // 400
                    InvalidOperationException => HttpStatusCode.Conflict,         // 409
                    _ => HttpStatusCode.InternalServerError                       // 500
                };

                await HandleExceptionAsync(context, ex, statusCode);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception ex, HttpStatusCode statusCode)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            Log.Error(ex, "💥 [{StatusCode}] {Error}: {Message}", (int)statusCode, ex.GetType().Name, ex.Message);

            var response = new
            {
                status = (int)statusCode,
                success = false,
                error = ex.GetType().Name,
                message = ex.Message
            };

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            });

            await context.Response.WriteAsync(json);
        }
    }
}
