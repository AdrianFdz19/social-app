// PostSummary.tsx

interface PostSummaryProps {
  reactions: {
    likes?: number;
  },
  commentsCount: number;
}

export default function PostSummary({reactions, commentsCount }: PostSummaryProps) {
  return (
    <div className="post__summary">
        <p className="post__summary__data">{reactions.likes} likes</p>
        <p className="post__summary__data">{commentsCount} comments</p>
    </div>
  )
}
