using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net.WebSockets;
using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

public class WebSocketStartup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // No additional services needed for basic WebSocket
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        var webSocketOptions = new WebSocketOptions
        {
            KeepAliveInterval = TimeSpan.FromMinutes(2)
        };
        app.UseWebSockets(webSocketOptions);

        var webSocketConnections = new ConcurrentBag<WebSocket>();

        app.Use(async (context, next) =>
        {
            if (context.Request.Path == "/ws/orders")
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
            }
            else
            {
                await next();
            }
        });

        // Make the broadcaster accessible
        OrderWebSocketBroadcaster.Connections = webSocketConnections;
    }
}