namespace BACKEND.DTOs
{
    public class EmailSendDto
    {
        public EmailSendDto(string to, string subject, string body) 
        {
            this.To = to;
            this.Subject = subject;
            this.Body = body;
   
        }

        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }

    }
}