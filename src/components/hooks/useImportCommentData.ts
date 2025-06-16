import { useMutation } from '@tanstack/react-query';
import { useApiContext } from '../contexts/ApiContext';
import { Channel, ChannelSubs, CommentData, Course, SecurityDomain } from '@/types/types';
import { log } from 'console';

interface GenerateSettingsOptions {
  userName: string;
  userId: string;
  folderName: string;
  folderSecurityDomain: SecurityDomain;
  folderId: string;
  commentData: CommentData;
}

const generateSettings = ({
  folderId,
  folderName,
  folderSecurityDomain,
  userId,
  userName,
  commentData,
}: GenerateSettingsOptions) => {
  const dataJson = new Blob([JSON.stringify(commentData)], {
    type: 'application/json',
  });

  const details = {
    // author: userName,
    // authorId: userId,
    contentName: 'comments.json',
    content_format: '3',
    // contentFolderName: folderName,
    // domain: folderSecurityDomain.id,
    parentFolderId: folderId,
    version: Date.now().toLocaleString(),
    language: 'English',
    playerTemplateId: 'pltpt000000000000001',
    isUrl: false,
  };

  const formData = new FormData();
  formData.append('detail', JSON.stringify(details));
  formData.append('files', dataJson, 'comments.json');

  return formData;
};

const useImportCommentData = () => {
  const {
    apiCertificate,
    folderId,
    folderName,
    folderSecurityDomain,
    userId,
    userName,
    commentDataFileId,
    commentData,
  } = useApiContext();
  const mutation = useMutation({
    mutationKey: ['import-sub-data'],
    mutationFn: () => {
      const formData = generateSettings({
        folderId,
        folderName,
        folderSecurityDomain,
        userId,
        userName,
        commentData,
      });
      return fetch(
        `https://hpi-api.sabacloud.com/v1/contentinventory/contentimport/${commentDataFileId}`,
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,pl;q=0.8',
            sabacertificate: apiCertificate,
          },
          body: formData,
          method: 'PUT',
          mode: 'cors',
          credentials: 'omit',
        }
      ).then((response) => {
        if (!response.ok) {
          console.log('failed');
          throw new Error();
        }
      });
    },
  });

  return mutation;
};

export default useImportCommentData;