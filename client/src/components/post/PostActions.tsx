// PostActions.tsx

import { postIcons } from "../../assets/icons"

export default function PostActions({userReaction}) {
  return (
    <div className="post__actions">
        <div className="post__actions__action">
          <postIcons.like className="postact-icon" />
          <p >Like</p>
        </div>
        <div className="post__actions__action">
          <postIcons.comment className="postact-icon" />
          <p>Comment</p>
        </div>
        <div className="post__actions__action">
          <postIcons.share className="postact-icon" />
          <p>Share</p>
        </div>
        <div className="post__actions__action">
          <postIcons.save className="postact-icon" />
          <p>Save</p>
        </div>
    </div>
  )
}
