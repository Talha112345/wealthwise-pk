import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "var(--primary)", minHeight: "100vh",
      color: "var(--text)", display: "flex",
      alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "80px", marginBottom: "16px" }}>404</div>
        <h2 style={{ color: "var(--highlight)", marginBottom: "12px" }}>Page Not Found</h2>
        <p style={{ color: "#aaa", marginBottom: "24px" }}>
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 28px", background: "var(--highlight)",
            color: "white", border: "none", borderRadius: "6px",
            cursor: "pointer", fontSize: "16px", fontWeight: "bold"
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;