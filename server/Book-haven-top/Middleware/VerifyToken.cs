using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System;

namespace Book_haven_top.Middleware
{
    public class VerifyTokenMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _jwtKey;
        private readonly string _jwtIssuer;

        public VerifyTokenMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _jwtKey = configuration["Jwt:Key"];
            _jwtIssuer = configuration["Jwt:Issuer"];
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Token is missing.");
                return;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtKey);
            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _jwtIssuer,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);
                context.User = principal;
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync($"Invalid or expired token. Error: {ex.Message}");
                return;
            }

            await _next(context);
        }
    }

    public static class VerifyTokenMiddlewareExtensions
    {
        public static IApplicationBuilder UseVerifyToken(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<VerifyTokenMiddleware>();
        }
    }
}