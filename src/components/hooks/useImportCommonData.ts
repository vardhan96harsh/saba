import { useMutation } from '@tanstack/react-query';
import { useApiContext } from '../contexts/ApiContext';
import { Channel, Course, SecurityDomain, VideoData } from '@/types/types';

interface GenerateSettingsOptions {
  userName: string;
  userId: string;
  folderName: string;
  folderSecurityDomain: SecurityDomain;
  folderId: string;
  commonData: any;
}

// ✅ Save JSON Data to LocalStorage Instead of File System
const saveJsonSafely = (data: any) => {
  try {
    const jsonData = JSON.stringify(data, null, 2);

    // ✅ Validate JSON before saving
    JSON.parse(jsonData);

    // ✅ Save to LocalStorage (since fs is not available in frontend)
    localStorage.setItem('commonData', jsonData);

    console.log('✅ common.json saved successfully in LocalStorage!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error saving common.json:', error);
    return { success: false, message: error.message };
  }
};

// ✅ Function to Generate Form Data (for API)
const generateSettings = async ({
  folderId,
  folderName,
  folderSecurityDomain,
  userId,
  userName,
  commonData,
}: GenerateSettingsOptions) => {
  // Save the file safely before making the API call
  const saveResult = saveJsonSafely(commonData);

  if (!saveResult.success) {
    alert('⚠️ Failed to save data. Network might be slow. Please try again.');
    throw new Error('Failed to save JSON file.');
  }

  const dataJson = new Blob([JSON.stringify(commonData)], {
    type: 'application/json',
  });

  const details = {
    contentName: 'common.json',
    content_format: '3',
    parentFolderId: folderId,
    version: Date.now().toLocaleString(),
    language: 'English',
    playerTemplateId: 'pltpt000000000000001',
    isUrl: false,
  };

  const formData = new FormData();
  formData.append('detail', JSON.stringify(details));
  formData.append('files', dataJson, 'common.json');

  return formData;
};

// ✅ Hook to Import Data
const useImportData = () => {
  const {
    apiCertificate,
    folderId,
    folderName,
    folderSecurityDomain,
    userId,
    userName,
    commonData,
    commonDataFileId: dataFileId,
  } = useApiContext();

  const mutation = useMutation({
    mutationKey: ['import-common-data'],
    mutationFn: async () => {
      try {
        const formData = await generateSettings({
          folderId,
          folderName,
          folderSecurityDomain,
          userId,
          userName,
          commonData,
        });

        const response = await fetch(
          `https://hpi-api.sabacloud.com/v1/contentinventory/contentimport/${dataFileId}`,
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
        );

        if (!response.ok) {
          console.error('❌ API request failed:', response.status, response.statusText);
          alert('⚠️ Upload failed! Please check your network and try again.');
          throw new Error(`API request failed with status: ${response.status}`);
        }

        console.log('✅ Data uploaded successfully!');
      } catch (error) {
        console.error('❌ Error during data upload:', error);
        alert('⚠️ Something went wrong. Please try again later.');
      }
    },
  });

  return mutation;
};

export default useImportData;
