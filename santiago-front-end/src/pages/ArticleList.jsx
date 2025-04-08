import React from 'react';
import { Link } from 'react-router-dom';

function ArticleList() {
  const articles = [
    { id: 1, title: '1st Place – NU STEM Wizards Quiz Bee' },
    { id: 2, title: 'Top 3 – GDSC Ideathon' },
    { id: 3, title: 'Google I/O Extended Manila 2024' },
  ];

  return (
    <div className="page articles-page">
      <h1 className="page-title">My Achievements & Seminars</h1>
      <p className="page-content">
        Check out my highlights below for more details:
      </p>
      <ul className="article-list">
        {articles.map((art) => (
          <li key={art.id} className="article-list-item">
            <Link to={`/articles/${art.id}`}>{art.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticleList;
