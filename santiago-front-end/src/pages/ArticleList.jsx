import { Link } from "react-router-dom";

function ArticleList() {
  // Example data
  const articles = [
    { id: 1, title: "Article One" },
    { id: 2, title: "Article Two" },
    { id: 3, title: "Article Three" },
  ];

  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link to={`/article/${article.id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticleList;
