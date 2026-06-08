import { useState } from 'react';
import { useApplicationStore } from '../../../../store/applicationStore';
import { Button } from '../../../../components/ui/Button';
import { Textarea } from '../../../../components/ui/Input';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter
} from '../../../../components/ui/Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const RejectConfirmationModal = ({ applicationId, onClose }) => {
  const [hrNotes, setHrNotes] = useState("");
  const updateApplicationStage = useApplicationStore((state) => state.updateApplicationStage);
  const loading = useApplicationStore((state) => state.loading);

  const handleConfirm = async () => {
    try {
      await updateApplicationStage(applicationId, {
        stage: { key: 'rejected' },
        notes: hrNotes.trim() || '',
      });
      onClose();
    } catch (error) {
      console.error("Failed to reject candidate:", error);
    }
  };

  return (
    <Modal open={true} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <ModalTitle className="text-red-600 font-bold text-lg">
                Reject Candidate
              </ModalTitle>
              <ModalDescription className="text-xs mt-0.5">
                This will move the applicant to the rejected stage and trigger a feedback process.
              </ModalDescription>
            </div>
          </div>
        </ModalHeader>

        <div className="py-4 space-y-3">
          <Textarea
            label="Internal Rejection Notes / Feedback (Optional)"
            placeholder="Describe the reason for rejection (e.g., Lacks core experience, low technical interview rating)..."
            value={hrNotes}
            onChange={(e) => setHrNotes(e.target.value)}
            rows={4}
            maxLength={500}
            disabled={loading}
          />
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Minimum 10 characters recommended if you want to provide constructive feedback.</span>
            <span>{hrNotes.length}/500</span>
          </div>
        </div>

        <ModalFooter className="gap-2 sm:gap-0 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                Rejecting...
              </>
            ) : (
              "Confirm Rejection"
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};