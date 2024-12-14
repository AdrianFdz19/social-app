// PostBody.tsx

interface PostBodyProps {
  content: string; 
  mediaFiles: string[];
}

export default function PostBody({content, mediaFiles}: PostBodyProps) {
  return (
    <div className="post__body">
        { content &&
        <div className="post__body__content">
            <p>{content}</p>
        </div>
        }
        { mediaFiles.length > 0 &&
        <div className="post__body__media">
            <img src={mediaFiles[0]} alt="media" />
        </div>
        }
    </div>
  )
}
