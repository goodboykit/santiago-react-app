import React from 'react';
import { useParams, Link } from 'react-router-dom';
import articles from '../../article-content';
import '../../styles/ArticlePage.css';

function ArticlePage() {
  const { name } = useParams();
  
  // Find the article by name (now category name)
  const article = articles.find((article) => article.name.toLowerCase() === name.toLowerCase());

  if (!article) {
    return (
      <div className="article-page">
        <h1 className="page-title">Category Not Found</h1>
        <p className="page-subtitle">We couldn't locate this category. Please go back and try another.</p>
        <Link to="/articles" className="back-link">Back to All Categories</Link>
      </div>
    );
  }

  return (
    <div className="article-page">
      <h1 className="page-title">{article.title}</h1>
      <p className="page-subtitle">Category: {article.name}</p>

      <div className="page-content">
        {article.content.map((paragraph, index) => (
          <div key={index} className="article-paragraph">
            <span className="icon"><i className="fas fa-circle-check"></i></span>
            <span>{paragraph}</span>
          </div>
        ))}
      </div>
      
      <div className="article-navigation">
        <Link to="/articles" className="back-link">Back to All Categories</Link>
      </div>
    </div>
  );
}

export default ArticlePage;
