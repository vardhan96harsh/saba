import { useMutation } from '@tanstack/react-query';
import { useApiContext } from '../contexts/ApiContext';
import { Host } from '@/types/types';

interface GenerateHostSettingsOptions {
  userName: string;
  userId: string;
  folderName: string;
  folderSecurityDomain: any; // Adjust according to your type
  folderId: string;
  hostData: Host[];
}

// ✅ Generate FormData
const generateHostSettings = async ({
  folderId,
  folderName,
  folderSecurityDomain,
  userId,
  userName,
  hostData,
}: GenerateHostSettingsOptions) => {
  const hostJson = new Blob([JSON.stringify(hostData)], {
    type: 'application/json',
  });

  const details = {
    contentName: 'host.json',
    content_format: '3',
    parentFolderId: folderId,
    version: Date.now().toLocaleString(),
    language: 'English',
    playerTemplateId: 'pltpt000000000000001',
    isUrl: false,
  };

  const formData = new FormData();
  formData.append('detail', JSON.stringify(details));
  formData.append('files', hostJson, 'host.json');

  return formData;
};

// ✅ Hook
const useImportHostData = () => {
  const {
    apiCertificate,
    folderId,
    folderName,
    folderSecurityDomain,
    userId,
    userName,
    hostDataFileId, // Make sure this is added in ApiContext.tsx
    setHostData, // Update state with the new host data
  } = useApiContext();

  const mutation = useMutation({
    mutationKey: ['import-host-data'],
    mutationFn: async (newHostData: Host[]) => {
      try {
        const formData = await generateHostSettings({
          folderId,
          folderName,
          folderSecurityDomain,
          userId,
          userName,
          hostData: newHostData,
        });

        const response = await fetch(
          `https://hpi-api.sabacloud.com/v1/contentinventory/contentimport/${hostDataFileId}`,
          {
            headers: {
              accept: 'application/json, text/plain, */*',
              sabacertificate: apiCertificate,
            },
            body: formData,
            method: 'PUT',
            mode: 'cors',
            credentials: 'omit',
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }

        console.log('✅ Host data uploaded successfully!');

        // After upload success, you can re-fetch the host data or update the state:
        setHostData(newHostData); // Ensure the state gets updated

      } catch (error) {
        console.error('❌ Upload error:', error);
        alert('⚠️ Upload failed! Please try again later.');
      }
    },
  });

  return mutation;
};

export default useImportHostData;
