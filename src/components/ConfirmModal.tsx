import "../styles/ConfirmModal.css";

interface ConfirmModalProps {
  visible: boolean; // 모달 열림 여부
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>; // 확인 버튼 클릭
  onCancel: () => void; // 취소 버튼 클릭
}

export default function ConfirmModal({
  visible,
  title = "확인",
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!visible) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        {title && <h2 className="confirm-title">{title}</h2>}
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button type="button" className="confirm-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="confirm-confirm" onClick={void onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
