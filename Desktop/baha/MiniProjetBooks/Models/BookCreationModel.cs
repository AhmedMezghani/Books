namespace WebApplication2.Models
{
    public class BookCreationModel
    {
        public string Content { get; set; }
        public string Titles { get; set; }
        public double price { get; set; }
        public int AuthorId { get; set; }
        public Author author { get; set; }
    }
}
