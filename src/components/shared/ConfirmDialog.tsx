import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  danger?: boolean
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'تأكيد',
  danger = true,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3 mb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-status-warning/15">
          <AlertTriangle className="h-5 w-5 text-status-warning" />
        </div>
        <p className="text-sm text-white/60 leading-relaxed pt-1.5">{description}</p>
      </div>
      <div className="flex justify-end gap-2.5">
        <button onClick={onClose} className="btn-secondary">
          إلغاء
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={danger ? 'btn-danger' : 'btn-primary'}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
