import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Alert, { type AlertKind } from "./Alert";
import "../styles/Alert.css";

type ShowArgs = { message: string; kind?: AlertKind; duration?: number };

type Ctx = {
  show: (message: string, opts?: Omit<ShowArgs, "message">) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
};

const AlertCtx = createContext<Ctx | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Array<{ id: string } & ShowArgs>>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const show = useCallback<Ctx["show"]>((message, opts) => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [
      ...prev,
      {
        id,
        message,
        kind: opts?.kind ?? "info",
        duration: opts?.duration ?? 2500,
      },
    ]);
  }, []);

  const ctx = useMemo<Ctx>(
    () => ({
      show,
      success: (m, d) => show(m, { kind: "success", duration: d }),
      error: (m, d) => show(m, { kind: "error", duration: d }),
      info: (m, d) => show(m, { kind: "info", duration: d }),
    }),
    [show],
  );

  return (
    <AlertCtx.Provider value={ctx}>
      {children}
      <div className="gm-alert-stack">
        {items.map((a) => (
          <Alert
            key={a.id}
            id={a.id}
            message={a.message}
            kind={a.kind}
            duration={a.duration}
            onClose={remove}
          />
        ))}
      </div>
    </AlertCtx.Provider>
  );
}

export function useAlert() {
  const v = useContext(AlertCtx);
  if (!v) throw new Error("useAlert must be used within <AlertProvider />");
  return v;
}
