namespace BACKEND.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 100;
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 100;
        public int PageSize 
        { 
            get => _pageSize; 
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; 
        }
        public string CurrentUsername { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;

        public int MaxAge { get; set; } = 120;
        public string OrderBy { get; set; } = "lastActive";
    }
}