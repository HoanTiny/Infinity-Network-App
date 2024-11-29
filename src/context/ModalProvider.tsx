/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ChatBoxContextType {
  onOpenPopup: (content: ReactElement) => void;
}

const ModalContext = createContext({} as ChatBoxContextType);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

import { ReactNode } from 'react';

interface ModalProviderProps {
  children: ReactNode;
}

function ModalProvider({ children }: ModalProviderProps) {
  const [isShowing, setIsShowing] = useState(false);
  const [content, setContent] = useState<ReactElement>();

  useEffect(() => {
    if (isShowing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  }, [isShowing]);

  const onOpenPopup = (content: ReactElement) => {
    setContent(content);
    setIsShowing(true);
  };

  return (
    <ModalContext.Provider value={{ onOpenPopup }}>
      {children}
      {isShowing && (
        <div className="fixed inset-0">
          <div
            className="absolute inset-0 flex items-center justify-center bg-slate-600/60 "
            onClick={() => setIsShowing(false)}
          >
            {content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export default ModalProvider;
