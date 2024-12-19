// PostSummary.tsx

interface PostSummaryProps {
  reactions: {
    like?: number;
  },
  commentsCount: number;
}

export default function PostSummary({reactions, commentsCount }: PostSummaryProps) {
  return (
    <div className="post__summary">
        <p className="post__summary__data">{reactions.like} likes</p>
        <p className="post__summary__data">{commentsCount} comments</p>
    </div>
  )
}
