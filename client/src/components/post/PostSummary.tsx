// PostSummary.tsx

export default function PostSummary({reactions, commentsCount = 0}) {
  return (
    <div className="post__summary">
        <p className="post__summary__data">{reactions.likes} likes</p>
        <p className="post__summary__data">{commentsCount} comments</p>
    </div>
  )
}
