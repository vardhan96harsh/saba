import React from 'react';

interface TruncatedTextProps {
  text: string;
  wordLimit: number;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, wordLimit }) => {
  const truncateText = (str: string, num: number): string => {
    return str.split(' ').slice(0, num).join(' ') + '...';
  };

  return (
    <div className="text-base line-clamp-1">
      {truncateText(text, wordLimit)}
    </div>
  );
};

export default TruncatedText;
