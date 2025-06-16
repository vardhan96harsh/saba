import React, { useState, useEffect } from 'react';
import { VideoData } from '@/types/types';
import { Button, Link } from '../dataEntry';
import useImportData from '../hooks/useImportData';

interface FooterButtonsProps {
  data: VideoData;
  isPublishEnabled: boolean;
}

interface NoteProps {
  variant: 'error' | 'success';
  children: React.ReactNode;
  onClose: () => void;
}

const Note = ({ variant, children, onClose }: NoteProps) => {
  let variantClasses = '';

  switch (variant) {
    case 'error':
      variantClasses = 'bg-red-200 text-red-600';
      break;
    case 'success':
      variantClasses = 'bg-green-200 text-green-600';
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`mr-auto flex items-center px-4 py-2 font-goodHeadlineMedium ${variantClasses}`}
    >
      {children}
    </div>
  );
};

const FooterButtons = ({ data, isPublishEnabled }: FooterButtonsProps) => {
  const { mutateAsync, isPending } = useImportData();
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [messageVariant, setMessageVariant] = useState<'error' | 'success'>('success');

  const handleImportData = async () => {
    try {
      await mutateAsync();
      setMessageVariant('success');
    } catch {
      setMessageVariant('error');
    } finally {
      setShowMessage(true);
    }
  };

  return (
    <div className='flex justify-between gap-4 px-4 py-2'>
      {showMessage && (
        <Note
          variant={messageVariant}
          onClose={() => setShowMessage(false)}
        >
          {messageVariant === 'success'
            ? 'Data saved successfully on server.'
            : 'Failed to save data on server, upload manually or try again later.'}
        </Note>
      )}
      <Link
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(data)
        )}`}
        download='filename.json'
        label='Download'
      />
      <Button
        onClick={handleImportData}
        isLoading={isPending}
     // Disable button if not enabled
      >
        Publish
      </Button>
    </div>
  );
};

export default FooterButtons;
