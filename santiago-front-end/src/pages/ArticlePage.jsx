import React from 'react';
import { useParams } from 'react-router-dom';
import articles from '../article-content';
import '../styles/ArticlePage.css';

function ArticlePage() {
  const { name } = useParams();
  const article = articles.find((article) => article.name === name);

  if (!article) {
    return (
      <div className="article-page">
        <h1 className="page-title">Article Not Found</h1>
        <p className="page-subtitle">We couldn’t locate this article. Please go back and try another.</p>
      </div>
    );
  }

  return (
    <div className="article-page">
      <h1 className="page-title">{article.title}</h1>
      <h2 className="page-subtitle">{article.name}</h2>

      <div className="page-content">
        {article.content.map((paragraph, index) => (
          <div key={index} className="article-paragraph">
            <span className="icon"><i className="fas fa-circle-check"></i></span>
            <span>{paragraph}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticlePage;
