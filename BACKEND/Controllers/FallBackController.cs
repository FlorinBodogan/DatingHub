using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    public class FallBackController : Controller
    {
        public ActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"),
             "text/HTML");
        }
    }
}