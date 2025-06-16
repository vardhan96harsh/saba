import { useMutation } from '@tanstack/react-query';
import { useApiContext } from '../contexts/ApiContext';
import { Channel, ChannelSubs, Course, SecurityDomain } from '@/types/types';

interface GenerateSettingsOptions {
  userName: string;
  userId: string;
  folderName: string;
  folderSecurityDomain: SecurityDomain;
  folderId: string;
  subData: ChannelSubs;
}

const generateSettings = ({
  folderId,
  folderName,
  folderSecurityDomain,
  userId,
  userName,
  subData,
}: GenerateSettingsOptions) => {
  const dataJson = new Blob([JSON.stringify(subData)], {
    type: 'application/json',
  });

  const details = {
    // author: userName,
    // authorId: userId,
    contentName: 'subscribe.json',
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
  formData.append('files', dataJson, 'subscribe.json');

  return formData;
};

const useImportSubData = () => {
  const {
    apiCertificate,
    folderId,
    folderName,
    folderSecurityDomain,
    userId,
    userName,
    subData,
    subDataFileId,
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
        subData,
      });
      return fetch(
        `https://hpi-api.sabacloud.com/v1/contentinventory/contentimport/${subDataFileId}`,
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

export default useImportSubData;   