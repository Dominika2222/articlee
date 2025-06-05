const client = supabase.createClient(
  "https://ikgygbhwmdttsomkfxiy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZ3lnYmh3bWR0dHNvbWtmeGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjAyMTMsImV4cCI6MjA2MzIzNjIxM30.6F0ZtryV1Io7aH3EIUQqy_CkAtgIsN-NdFZoSklYRYc"
);

// Function to fetch and display articles
async function displayArticles() {
  const sortValue = document.getElementById("sortSelect").value;
  const [field, direction] = sortValue.split(".");

  const { data, error } = await client
    .from("article")
    .select("*")
    .order(field, { ascending: direction === "asc" });

  if (error) {
    console.error("Error:", error);
    return;
  }

  const articlesDiv = document.getElementById("articles");
  articlesDiv.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Subtitle</th>
          <th>Author</th>
          <th>Date</th>
          <th>Content</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (article) => `
          <tr>
            <td>${article.title}</td>
            <td>${article.subtitle || ""}</td>
            <td>${article.author || ""}</td>
            <td>${new Date(article.created_at).toLocaleString()}</td>
            <td>${article.content || ""}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

// Load articles when page loads
document.addEventListener("DOMContentLoaded", displayArticles);

// Handle form submission
document.getElementById("articleForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const article = {
    title: document.getElementById("title").value,
    subtitle: document.getElementById("subtitle").value,
    author: document.getElementById("author").value,
    content: document.getElementById("content").value,
    created_at: document.getElementById("created_at").value,
  };

  const { error } = await client.from("article").insert([article]);

  if (error) {
    console.error("Error adding article:", error);
    alert("Error adding article");
    return;
  }

  alert("Article added successfully!");
  e.target.reset();

  displayArticles(); // Refresh the table after successful submission
});

// Add sort event listener
document
  .getElementById("sortSelect")
  .addEventListener("change", displayArticles);
