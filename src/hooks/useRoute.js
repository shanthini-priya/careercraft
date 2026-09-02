import { useState, useEffect } from "react";

function useRoute() {
  const [route, setRoute] = useState(window.location.hash || "#home");
  useEffect(() => {
    const handler = () => setRoute(window.location.hash || "#home");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const nav = (r) => { window.location.hash = r; };
  return [route, nav];
}

export default useRoute;
