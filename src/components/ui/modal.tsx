import React from 'react';
import { Dialog } from '@headlessui/react'; // Headless UI dan foydalaning
import { Button } from "@/components/ui/button"; // Shadcn button komponenti

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <Dialog.Panel className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          <Dialog.Description>{children}</Dialog.Description>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
