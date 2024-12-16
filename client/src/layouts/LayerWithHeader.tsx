// Header.tsx

import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

export default function LayerWithHeader() {
  return (
    <>
        <Header />
        <Outlet />
    </>
  )
}
