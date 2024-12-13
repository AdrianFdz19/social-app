// PostBody.tsx

export default function PostBody({content, mediaFiles}) {
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
