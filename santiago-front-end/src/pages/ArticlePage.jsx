import { useParams } from "react-router-dom";

function ArticlePage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Article {id}</h1>
      {/* Enhancement 2: Insert an image, more detailed content, etc. */}
      <p>This page will display more info about Article {id}.</p>
    </div>
  );
}

export default ArticlePage;
