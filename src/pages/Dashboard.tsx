import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to first metric detail page
    navigate("/metric/daily-active-customers", { replace: true });
  }, [navigate]);

  return null;
}
