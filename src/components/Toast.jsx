import React from 'react';
import { useStore } from '../context/StoreContext';

export const Toast = () => {
  const { toast } = useStore();

  return (
    <div className={`app-toast ${toast.show ? 'show' : ''}`}>
      <ion-icon name="checkmark-circle-outline" style={{ fontSize: '20px', color: 'var(--tan-crayola)' }}></ion-icon>
      <span>{toast.message}</span>
    </div>
  );
};
