// Home.tsx

import Feed from "./Feed";
import './Home.scss';

export default function Home() {
  return (
    <div className="home">
        <div className="home__content">
            <Feed />
        </div>
    </div>
  )
}
