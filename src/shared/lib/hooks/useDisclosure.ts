import { useCallback, useState } from "react";

type UseDisclosureOptions = {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export function useDisclosure({
  defaultOpen = false,
  onOpen,
  onClose,
}: UseDisclosureOptions = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen((current) => {
      if (!current) onOpen?.();
      return true;
    });
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen((current) => {
      if (current) onClose?.();
      return false;
    });
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen((current) => {
      if (current) {
        onClose?.();
        return false;
      }

      onOpen?.();
      return true;
    });
  }, [onOpen, onClose]);

  return { isOpen, open, close, toggle, setIsOpen };
}
