import React from 'react';
import { Link } from 'react-router-dom';
import articles from '../article-content.js'; 
import '../styles/ArticleList.css';


function ArticleListPage() {
  return (
    <div className="page article-list-page">
      <h1 className="page-title">All Articles</h1>

      {articles.map((article) => (
        <Link
          key={article.name}
          to={`/articles/${article.name}`}
          className="article-preview-card"
        >
          <h3 className="article-title">{article.title}</h3>
          <p className="article-snippet">
            {article.content[0].substring(0, 150)}...
          </p>
        </Link>
      ))}
    </div>
  );
}

export default ArticleListPage;
