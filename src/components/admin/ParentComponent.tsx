import React, { useState } from 'react';
import FooterButtons from './FooterButtons';
import EditChannelComponent from './EditChannelComponent';
import { VideoData } from '@/types/types';

interface ParentComponentProps {
  data: VideoData;
}

const ParentComponent = ({ data }: ParentComponentProps) => {
  const [isPublishEnabled, setIsPublishEnabled] = useState(false);

  const enablePublish = () => {
    setIsPublishEnabled(true);
  };

  return (
    <>
      <EditChannelComponent data={data} onAction={enablePublish} />
      <FooterButtons data={data} isPublishEnabled={isPublishEnabled} />
    </>
  );
};

export default ParentComponent;
