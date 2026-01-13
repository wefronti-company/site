import React, { createContext, useContext, useState, ReactNode } from 'react';

type MenuContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(v => !v);

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return;
  }, [open]);

  return (
    <MenuContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
};
