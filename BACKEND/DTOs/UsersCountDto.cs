namespace BACKEND.DTOs
{
    public class UsersCountDto
    {
        public int UsersLastDay { get; set; }
        public int UsersLastWeek { get; set; }
        public int UsersLastMonth { get; set; }
        public int UsersLast3Months { get; set; }
        public int UsersLast6Months { get; set; }
        public int UsersLastYear { get; set; }
    }
}