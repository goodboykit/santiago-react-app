import React from 'react';
import { useParams } from 'react-router-dom';
import articles from '../article-content.js'; 
import '../styles/ArticlePage.css';


function ArticlePage() {
  const { name } = useParams(); 
  const article = articles.find((article) => article.name === name);

  if (!article) {
    return (
      <div className="page not-found">
        <h1 className="page-title">Article Not Found</h1>
        <p className="page-content">Sorry, we couldn't find the article you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="page article-page">
      <h1 className="page-title">{article.title}</h1>
      <h2 className="page-subtitle">{article.name}</h2>
      <div className="page-content">
        {article.content.map((paragraph, index) => (
          <p key={index} className="article-paragraph">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export default ArticlePage;
