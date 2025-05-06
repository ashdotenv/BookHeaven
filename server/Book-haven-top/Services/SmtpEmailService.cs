using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Book_haven_top.Services
{
    public class SmtpEmailService
    {
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUser;
        private readonly string _smtpPass;
        private readonly string _fromEmail;

        public SmtpEmailService(string smtpHost, int smtpPort, string smtpUser, string smtpPass, string fromEmail)
        {
            _smtpHost = smtpHost;
            _smtpPort = smtpPort;
            _smtpUser = smtpUser;
            _smtpPass = smtpPass;
            _fromEmail = fromEmail;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                using (var client = new SmtpClient(_smtpHost, _smtpPort))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(_smtpUser, _smtpPass);
                    var mail = new MailMessage(_fromEmail, toEmail, subject, body);
                    mail.IsBodyHtml = true;
                    await client.SendMailAsync(mail);
                }
            }
            catch (SmtpException ex)
            {
                Console.WriteLine($"SMTP Error: {ex.Message}\n{ex.StackTrace}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email Send Error: {ex.Message}\n{ex.StackTrace}");
                throw;
            }
        }
    }
}