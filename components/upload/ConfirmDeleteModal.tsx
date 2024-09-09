import { DangerButton, SecondaryButton } from "@/theme/buttons/Buttons";
import React, { useState } from "react";

interface ConfirmDeleteModalProps {
  onConfirm: (password: string) => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
}) => {
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleConfirm = () => {
    if (password) {
      onConfirm(password);
    } else {
      alert("Please enter your password to proceed.");
    }
  };

  return (
    <div className="modal">
      {isOpen ? (
        <div className="modal-content">
          <h2>Confirm Deletion</h2>
          <p>Please enter your password to confirm data deletion.</p>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="modal-actions">
            <SecondaryButton onClick={() => setIsOpen(!isOpen)}>
              Cancel
            </SecondaryButton>
            <DangerButton onClick={handleConfirm}>Smazat</DangerButton>
          </div>
        </div>
      ) : (
        <DangerButton onClick={handleConfirm}>Smazat</DangerButton>
      )}
    </div>
  );
};

export default ConfirmDeleteModal;
