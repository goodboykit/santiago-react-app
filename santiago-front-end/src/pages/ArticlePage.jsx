import React from 'react';
import { useParams } from 'react-router-dom';

function ArticlePage() {
  const { id } = useParams();

  const articleData = {
    1: {
      title: '1st Place – NU STEM Wizards Quiz Bee',
      img: '/src/assets/quiz.png',
      content: 'A university-level competition focusing on STEM fundamentals. Winning 1st place validated my strong academic foundation and rapid problem-solving.'
    },
    2: {
      title: 'Top 3 – GDSC Ideathon',
      img: '/src/assets/ideathon.png',
      content: 'Collaborated with a team to build an innovative tech solution. Earned top 3 among many participants, showcasing creativity in problem-solving.'
    },
    3: {
      title: 'Google I/O Extended Manila 2024',
      img: '/src/assets/images.jpeg',
      content: 'Attended advanced sessions on AI, Android, and web dev. Networked with fellow developers, gained new insights on community-driven innovations.'
    }
  };

  const article = articleData[id];

  if (!article) {
    return <div className="page"><h2 className="page-title">Article Not Found</h2></div>;
  }

  return (
    <div className="page">
      <h1 className="page-title">{article.title}</h1>
      <img className="page-image" src={article.img} alt={article.title} />
      <p className="page-content">{article.content}</p>
    </div>
  );
}

export default ArticlePage;
