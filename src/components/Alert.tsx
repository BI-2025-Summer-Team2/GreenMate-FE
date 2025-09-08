import { useEffect } from "react";
import "../styles/Alert.css";

export type AlertKind = "success" | "error" | "info";

export default function Alert({
  id,
  message,
  kind = "info",
  onClose,
  duration = 2500,
}: {
  id: string;
  message: string;
  kind?: AlertKind;
  duration?: number;
  onClose: (id: string) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onClose]);

  return (
    <div className={`gm-alert gm-${kind}`} role="status">
      <span className="gm-msg">{message}</span>
      <button
        className="gm-close"
        onClick={() => onClose(id)}
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}
