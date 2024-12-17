// Header.tsx

import { Outlet } from "react-router-dom";
// @ts-ignore
import Header from "../components/header/Header.tsx";

export default function LayerWithHeader() {
  return (
    <>
        <Header />
        <Outlet />
    </>
  )
}
