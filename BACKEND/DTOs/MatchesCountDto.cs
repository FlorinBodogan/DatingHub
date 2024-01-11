namespace BACKEND.DTOs
{
    public class MatchesCountDto
    {
        public int MatchesLastDay { get; set; }
        public int MatchesLastWeek { get; set; }
        public int MatchesLastMonth { get; set; }
        public int MatchesLast3Months { get; set; }
        public int MatchesLast6Months { get; set; }
        public int MatchesLastYear { get; set; }
    }
}