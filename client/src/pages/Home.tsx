// Home.tsx

import Feed from "./Feed";
import './Home.scss';

export default function Home() {
  return (
    <div className="home">
        <div className="home__content">
            <h1>Welcome to the app!</h1>
            <Feed />
        </div>
    </div>
  )
}
