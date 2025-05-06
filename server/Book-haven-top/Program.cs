using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Book_haven_top.Middleware;
using Microsoft.Extensions.FileProviders;
using System.Net.WebSockets;
using System.Collections.Concurrent;
using System.Text.Json;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Load JWT configuration from appsettings.json
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton(new Book_haven_top.Services.SmtpEmailService(
smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUser: "ashishghimire445@gmail.com",
  smtpPass: "rivc wfws qwxv wauz", // IMPORTANT: Use App Password, not your Gmail password
  fromEmail: "ashishghimire445@gmail.com" // Replace with your from email
));

// Configure EF Core with PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS to allow all localhost origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalhostPolicy", policy =>
    {
        policy
            .SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

var app = builder.Build();

// WebSocket setup
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};
app.UseWebSockets(webSocketOptions);

// Store connected sockets
var webSocketConnections = new ConcurrentBag<WebSocket>();

app.Map("/ws/orders", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        webSocketConnections.Add(webSocket);
        while (webSocket.State == WebSocketState.Open)
        {
            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            if (result.MessageType == WebSocketMessageType.Close)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by client", CancellationToken.None);
            }
        }
    }
    else
    {
        context.Response.StatusCode = 400;
    }
});

// Helper to broadcast order messages
app.Services.GetService<IHostApplicationLifetime>()?.ApplicationStarted.Register(() =>
{
    OrderWebSocketBroadcaster.Connections = webSocketConnections;
});

public static class OrderWebSocketBroadcaster
{
    public static ConcurrentBag<WebSocket> Connections = new ConcurrentBag<WebSocket>();
    public static async Task BroadcastOrderAsync(object orderInfo)
    {
        var message = JsonSerializer.Serialize(orderInfo);
        var buffer = Encoding.UTF8.GetBytes(message);
        var segment = new ArraySegment<byte>(buffer);
        foreach (var socket in Connections)
        {
            if (socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(segment, WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }
}

app.UseStaticFiles(); //this enables serving static files from wwwroot

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "images")),
    RequestPath = "/images"
});

// Use development tools
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("LocalhostPolicy");

// Enable Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();
// Role-based middleware routing
app.UseWhen(context => context.Request.Path.StartsWithSegments("/api/admin"), appBuilder =>
{
    appBuilder.UseVerifyToken();
    appBuilder.UseRoleAuthorization("Admin");
});

app.UseWhen(context => context.Request.Path.StartsWithSegments("/api/user"), appBuilder =>
{
    appBuilder.UseVerifyToken();
    appBuilder.UseRoleAuthorization("User");
});

// Map controller routes
app.MapControllers();

// Start WebSocket server on a different port (e.g., 8081)
Task.Run(async () =>
{
    var wsHost = new WebHostBuilder()
        .UseKestrel(options =>
        {
            options.Listen(IPAddress.Loopback, 8081);
        })
        .UseStartup<WebSocketStartup>()
        .Build();
    await wsHost.RunAsync();
});

app.Run();
