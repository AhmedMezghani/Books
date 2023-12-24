$(document).ready(function () {
    getTitles();
    $("#addAuthorBtn").click(function () {
        $("#addAuthorDialog").modal("show");
    });
});
async function createBook(bookTitle, authorName, bookContent) {
    const data = {
        Titles: bookTitle,
        Content: bookContent,
        price: 0.0,  // You might want to set the default value for Price or adjust this based on your requirements
        AuthorId: 0,  // You might want to set the default value for AuthorId or adjust this based on your requirements
        author: {
            name: authorName
        }
    };
    
    const response = await fetch('/Books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        alert('Book created successfully!');
        $("#addBookDialog").modal("hide");
        getTitles();
    } else {
        const errorText = await response.text();
        alert(`${errorText}`);    }
}

async function getTitles() {
    const response = await fetch('/Books/GetTitles');
    const books = await response.json();
    var container = document.getElementById('books-container');
    if (container) {
        // Remove all children of the container
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }        // Iterate through the book titles and render them
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'col-sm-6 col-md-4 col-lg-3';

        bookElement.innerHTML = `
                <div class="box">
                    <div class="option_container">
                        <div class="options">
                            <a href="#Content" onclick="showContent(this)" class="option1">
                                Content
                            </a>
                            <a href="#Detail" onclick="showDialogDetail2(this)" class="option1">
                                Detail
                            </a>
                            <a  href="#searchWords" onclick="showDialog2(this)" class="option2" >
                                Search
                            </a>
                        </div>
                    </div>
                    <div class="img-box">
                        <img src="../images/book.png" alt="">
                    </div>
                    <div class="detail-box">
                        <h8>
                            ${book.author.name.trim()}
                        </h8>
                        <h7>
                            ${book.titles.trim()}
                        </h7>
                    </div>
                </div>
            `;
        container.appendChild(bookElement);

    });
        
    
}

async function getTopTenWords(currentAuthor, currentTitle) {
    
    const response = await fetch(`/Books/GetTopTenWords/${currentAuthor.trim()}/${currentTitle.trim()}`);
    const result = await response.json();
    if (result && typeof result === 'object') {
        // Get the table body element
        const tableBody = document.getElementById('topwordsTable').getElementsByTagName('tbody')[0];

        // Clear existing table rows
        tableBody.innerHTML = '';

        // Populate the table with the result
        for (const [word, occurrence] of Object.entries(result)) {
            const row = tableBody.insertRow();
            const cellWord = row.insertCell(0);
            const cellOccurrence = row.insertCell(1);

            cellWord.innerHTML = word;
            cellOccurrence.innerHTML = occurrence;
        }

    } else {
        console.error('Invalid result format:', result);
        // Handle the case where the result is not an object with key-value pairs
    }
}
async function getContent(currentAuthor, currentTitle) {

    const response = await fetch(`/Books/getContent/${currentAuthor.trim()}/${currentTitle.trim()}`);
    debugger;

    if (response.ok) {
        const content = await response.text();

        // Set the content of the textarea
        document.getElementById('largeContentTextarea').value = content;

        // Show the largeContentDialog
        $("#largeContentDialog").modal("show");
    } else {
        // Handle the case when the response is not OK (e.g., file not found)
        console.error(`Error: ${response.statusText}`);
    }
}
async function checkMatchingWord(currentAuthor, currentTitle, wordToCheck) {
   
        const response = await fetch(`/Books/FindSubstring/${currentAuthor.trim()}/${currentTitle.trim() }/${wordToCheck}`);
        const result = await response.json();
    
    if (result && typeof result === 'object') {
        // Get the table body element
        const tableBody = document.getElementById('wordsTable').getElementsByTagName('tbody')[0];

        // Clear existing table rows
        tableBody.innerHTML = '';

        // Populate the table with the result
        for (const [word, occurrence] of Object.entries(result)) {
            const row = tableBody.insertRow();
            const cellWord = row.insertCell(0);
            const cellOccurrence = row.insertCell(1);

            cellWord.innerHTML = word;
            cellOccurrence.innerHTML = occurrence;
        }

        // Show the modal
        $("#addAuthorDialog").modal("show");
    } else {
        console.error('Invalid result format:', result);
        // Handle the case where the result is not an object with key-value pairs
    }
    
}

async function findSubstring() {
    const bookId = document.getElementById('substringId').value;
    const substring = document.getElementById('substring').value;

    const response = await fetch(`/Books/FindSubstring/${bookId}/${substring}`);
    const words = await response.json();

    const substringList = document.getElementById('substringList');
    substringList.innerHTML = words.map(word => `<li>${word}</li>`).join('');
}
