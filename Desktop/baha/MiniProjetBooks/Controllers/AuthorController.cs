using Microsoft.AspNetCore.Mvc;
using WebApplication2.Models;
using WebApplication2.Services;

namespace WebApplication2.Controllers
{
    public class AuthorController : Controller
    {
        private readonly IAuthorService authorService;


        public AuthorController(IAuthorService authorService)
        {
            this.authorService = authorService;
        }

        [HttpPost("CreateAuthor", Name = "CreateAuthor")]

        public ActionResult Create([FromBody] Author author)
        {
            try
            {
                if (string.IsNullOrEmpty(author?.name))
                {
                    return BadRequest("name cannot be empty.");
                }
                var path = @".\\Authors\\{0}.txt";
                var pathWithTitles = string.Format(path, author.name);
                if (Directory.Exists(path))
                {
                    return BadRequest($"Author '{author.name}' already exists.");
                }

                // Create the author folder
                Directory.CreateDirectory(path);
                return Ok("Author '{author.name}' created successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating book: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }
    }
}
