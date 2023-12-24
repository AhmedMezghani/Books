using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication2.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BooksController : ControllerBase
    {

        [HttpPost(Name = "Create")]
        public async Task<IActionResult> Create([FromBody] BookCreationModel model)
        {
            try
            {
                if (model == null || string.IsNullOrEmpty(model.Titles))
                {
                    return BadRequest("Titles cannot be empty.");
                }

                // Assume model.Author.Name contains the author's name
                string authorFolderPath = Path.Combine("./Authors", model.author.name);

                // Check if the author's folder exists, create it if it doesn't
                if (!Directory.Exists(authorFolderPath))
                {
                    Directory.CreateDirectory(authorFolderPath);
                }

                // Assume model.Titles contains the book name
                string bookFilePath = Path.Combine(authorFolderPath, $"{model.Titles}.txt");

                // Check if the book file exists, create it if it doesn't
                if (!System.IO.File.Exists(bookFilePath))
                {
                    // You can add logic here to write content to the book file if needed
                    System.IO.File.WriteAllText(bookFilePath, model.Content);

                    return Ok("Book created successfully!");
                }
                else
                {
                    return BadRequest("Book with the same name already exists for the author.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating book: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        } 
        
        private int GetNextIndex()
        {
            int currentIndex = 3; 
                                 
            currentIndex++;
            return currentIndex;
        }

        [HttpGet("GetTitles", Name = "GetTitles")]
        public async Task<IActionResult> GetTitles()
        {
            var books = await GetBooksFromAuthors();

            return Ok(books);
        }

        //private async List<string> GetBooksTitles()
        //{
        //    var path = @".\Books"; 

        //    string[] books = Directory.GetFileSystemEntries(path, "*", SearchOption.AllDirectories);
        //    List<string> _books = new List<string>();

        //    foreach (var book in books)
        //    {

        //        var title = book.Replace(path, string.Empty).TrimStart('\\').TrimEnd(".txt".ToCharArray());

        //        _books.Add(title);
        //    }

        //    return _books;
        //}
        private async Task<List<BookCreationModel>> GetBooksFromAuthors()
        {
            var books = new List<BookCreationModel>();

            try
            {
                foreach (var authorFolder in Directory.GetDirectories("./Authors"))
                {
                    var author = new Author { name = Path.GetFileName(authorFolder) }; // Replace with actual author data

                    foreach (var bookFile in Directory.GetFiles(authorFolder, "*.txt"))
                    {
                        var content = await System.IO.File.ReadAllTextAsync(bookFile);
                        string title = Path.GetFileNameWithoutExtension(bookFile);

                        var book = new BookCreationModel
                        {
                            Content = content,
                            Titles = title,
                            author = author
                        };

                        books.Add(book);
                    }
                }

                return books;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                throw;
            }
        }

        [HttpGet("GetTopTenWords/{currentAuthor}/{currentTitle}", Name = "GetTopTenWords")]
        public async Task<IActionResult> GetTopTenWords(string currentAuthor,string currentTitle)
        {
            var _words = new List<string>();

            var words = ReadWordsFromFile(currentAuthor, currentTitle);
            var wordOccurrences = words
                .GroupBy(word => word)
                .OrderByDescending(group => group.Count())
                .Take(10)
                .ToDictionary(group => group.Key, group => group.Count());
            return Ok(wordOccurrences);
        }
        [HttpGet("getContent/{currentAuthor}/{currentTitle}", Name = "getContent")]
        public async Task<IActionResult> getContent(string currentAuthor, string currentTitle)
        {
            try
            {
                var filePath = Path.Combine("Authors", currentAuthor, currentTitle + ".txt");

                if (System.IO.File.Exists(filePath))
                {
                    var content = await System.IO.File.ReadAllTextAsync(filePath);
                    return Ok(content);
                }
                else
                {
                    return NotFound("File not found");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading file content: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
        private List<string> GetTopWords(string currentAuthor, string currentTitle)
        {
            var words = ReadWordsFromFile("","");
            var topTenWords = GetOcurrentWords(words);

            return topTenWords;
        }
        private string[] ReadWordsFromFile(string currentAuthor,string currentTitle)
        {
            var path = @"./Authors/{0}";
            var pathWithTitles = string.Format(path, currentAuthor);
            string[] books = Directory.GetFiles(pathWithTitles, "*.txt", SearchOption.AllDirectories);

            // Find the file with a name containing the specified ID
            var matchingFile = books.FirstOrDefault(file =>
            {
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(file);
                return fileNameWithoutExtension.Contains(currentTitle);
            });

            var filePath = matchingFile;

            string content;
            using (FileStream fs = new FileStream(filePath, FileMode.Open))
            {
                byte[] contentBytes = new byte[fs.Length];
                fs.Read(contentBytes, 0, contentBytes.Length);
                content = System.Text.Encoding.UTF8.GetString(contentBytes);
            }

            var words = content.Split(new[] { ' ', '\t', '\n', '\r', '.', ',', ';', ':', '!', '?' }, StringSplitOptions.RemoveEmptyEntries);

            return words;
        }

        private List<string> GetOcurrentWords(string[] words)
        {
            var wordCount = new Dictionary<string, int>();

            foreach (string word in words)
            {
                if (word.Length > 5)
                {
                    string cleanedWord = word.ToLower();
                    if (wordCount.ContainsKey(cleanedWord))
                    {
                        wordCount[cleanedWord]++;
                    }
                    else
                    {
                        wordCount[cleanedWord] = 1;
                    }
                }
            }

            var _words = wordCount.OrderByDescending(w => w.Value).Take(10);

            var topTenWords = new List<string>();
            foreach (var word in _words)
            {
                topTenWords.Add(word.Key);
            }

            return topTenWords;
        }

        
        //[HttpGet("IsMatchingWord/{id}/{word}", Name = "IsMatchingWord")]
        //public bool IsMatchingWord(int id, string word)
        //{
        //    var topTenWords = GetTopWords(id);
        //    foreach (var _word in topTenWords)
        //    {
        //        if (_word.ToLower() == word.ToLower())
        //        {
        //            return true;
        //        }
        //    }

        //    return false;
        //}

        [HttpGet("FindSubstring/{currentAuthor}/{currentTitle}/{wordToCheck}", Name = "FindSubstring")]
        public async Task<IActionResult> FindSubtringInWords(string currentAuthor, string currentTitle,string wordToCheck)
        {
            var _words = new List<string>();

            var words = ReadWordsFromFile(currentAuthor,currentTitle);
            foreach (var word in words)
            {
                if (word.Contains(wordToCheck))
                {
                    _words.Add(word);
                }
            }
            var wordOccurrences = words
    .Where(word => word.Contains(wordToCheck))
    .GroupBy(word => word)
    .OrderByDescending(group => group.Count())
    .Take(10)
    .ToDictionary(group => group.Key, group => group.Count());
            return Ok(wordOccurrences);
        }

    }
}