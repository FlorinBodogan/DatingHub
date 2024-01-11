namespace BACKEND.DTOs
{
    public class MessagesCountDto
    {
        public int MessagesLastDay { get; set; }
        public int MessagesLastWeek { get; set; }
        public int MessagesLastMonth { get; set; }
        public int MessagesLast3Months { get; set; }
        public int MessagesLast6Months { get; set; }
        public int MessagesLastYear { get; set; }
    }
}