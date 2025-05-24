import React from 'react';
import { Link } from 'react-router-dom';
import articles from '../../article-content';
import '../../styles/ArticleList.css';

function ArticleListPage() {
  return (
    <section className="article-list-page">
      <div className="article-header">
        <h1 className="page-title">📰 My Portfolio Categories</h1>
        <p className="page-subtitle">
          Browse through different categories showcasing my experience, skills, and development journey.
        </p>
      </div>

      <div className="article-grid">
        {articles.map((article) => (
          <Link key={article.name} to={`/articles/${article.name.toLowerCase()}`} className="article-card">
            <div className="article-card-content">
              <h3 className="article-card-title">{article.title}</h3>
              <p className="article-card-snippet">
                {article.content[0].substring(0, 120)}...
              </p>
              <span className="read-more">View Category →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ArticleListPage;
