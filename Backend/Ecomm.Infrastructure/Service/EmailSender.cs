using Ecomm.Application.Interfaces.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Ecomm.Infrastructure.Service;

public class EmailSender : IEmailSender
{
    private readonly SmtpSettings _smtp;
    private readonly ILogger<EmailSender> _logger;

    public EmailSender(IOptions<SmtpSettings> smtp, ILogger<EmailSender> logger)
    {
        _smtp = smtp.Value;
        _logger = logger;
    }

    public async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_smtp.FromName, _smtp.FromEmail));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;

        var builder = new BodyBuilder { HtmlBody = htmlBody };
        message.Body = builder.ToMessageBody();

        using var client = new SmtpClient();

        try
        {
            // 1. Set a strict timeout so it doesn't hang the API
            client.Timeout = 15000; 

            _logger.LogInformation("Connecting to {Host}:{Port}...", _smtp.Host, _smtp.Port);

            // 2. Try StartTls (Port 587)
            await client.ConnectAsync(_smtp.Host, _smtp.Port, SecureSocketOptions.StartTls, ct);

            _logger.LogInformation("Authenticating {Username}...", _smtp.Username);
            await client.AuthenticateAsync(_smtp.Username, _smtp.Password, ct);

            await client.SendAsync(message, ct);
            await client.DisconnectAsync(true, ct);

            _logger.LogInformation("Email sent successfully to {Email}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "SMTP FAILURE for {Email}", toEmail);
            throw; // Re-throw so your Controller can see the error
        }
    }
}

// v2
// public class EmailSender : IEmailSender
// {
//     private readonly SmtpSettings _smtp;
//     private readonly ILogger<EmailSender> _logger;
//
//     public EmailSender(IOptions<SmtpSettings> smtp, ILogger<EmailSender> logger)
//     {
//         _smtp = smtp.Value;
//         _logger = logger;
//     }
//
//     public async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default)
//     {
//         try
//         {
//             using var client = new SmtpClient(_smtp.Host, _smtp.Port)
//             {
//                 Credentials = new NetworkCredential(_smtp.Username, _smtp.Password),
//                 EnableSsl = _smtp.EnableSsl,
//                 DeliveryMethod = SmtpDeliveryMethod.Network,
//                 Timeout = 20000
//             };
//
//             using var msg = new MailMessage
//             {
//                 From = new MailAddress(_smtp.FromEmail, _smtp.FromName),
//                 Subject = subject,
//                 Body = htmlBody,
//                 IsBodyHtml = true
//             };
//
//             msg.To.Add(toEmail);
//
//             _logger.LogInformation("Sending OTP email to {ToEmail} via {Host}:{Port}", toEmail, _smtp.Host, _smtp.Port);
//             await client.SendMailAsync(msg, ct);
//             _logger.LogInformation("OTP email sent successfully to {ToEmail}", toEmail);
//         }
//         catch (SmtpException ex)
//         {
//             _logger.LogError(ex, "SMTP error while sending email to {ToEmail}. StatusCode={StatusCode}", toEmail, ex.StatusCode);
//             throw;
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Unexpected error while sending email to {ToEmail}", toEmail);
//             throw;
//         }
//     }
// }


// v1
// public class EmailSender : IEmailSender
// {
//     private readonly SmtpSettings _smtp;
//
//     public EmailSender(IOptions<SmtpSettings> smtp)
//     {
//         _smtp = smtp.Value;
//     }
//
//     public async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default)
//     {
//         using var client = new SmtpClient(_smtp.Host, _smtp.Port);
//         client.Credentials = new NetworkCredential(_smtp.Username, _smtp.Password);
//         client.EnableSsl = _smtp.EnableSsl;
//
//         using var msg = new MailMessage();
//         msg.From = new MailAddress(_smtp.FromEmail, _smtp.FromName);
//         msg.Subject = subject;
//         msg.Body = htmlBody;
//         msg.IsBodyHtml = true;
//         msg.To.Add(toEmail);
//
//         await client.SendMailAsync(msg, ct);
//     }
// }
