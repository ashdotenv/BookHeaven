using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Threading;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/sse")]
    public class SseController : ControllerBase
    {
        [HttpGet]
        public async Task Get(CancellationToken cancellationToken)
        {
            Response.Headers.Add("Content-Type", "text/event-stream");

            while (!cancellationToken.IsCancellationRequested)
            {
                await Response.WriteAsync($"data: The server time is {DateTime.Now}\n\n");
                await Response.Body.FlushAsync();
                await Task.Delay(1000, cancellationToken); // Send updates every second
            }
        }

        [HttpGet("send-message")]
        public async Task SendMessage(string message, CancellationToken cancellationToken)
        {
            Response.Headers.Add("Content-Type", "text/event-stream");

            while (!cancellationToken.IsCancellationRequested)
            {
                await Response.WriteAsync($"data: {message}\n\n");
                await Response.Body.FlushAsync();
                await Task.Delay(1000, cancellationToken); // Send updates every second
            }
        }
    }
}