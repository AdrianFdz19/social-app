// Header.tsx

import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";

export default function LayerWithHeader() {
  return (
    <>
        <Header />
        <Outlet />
    </>
  )
}
