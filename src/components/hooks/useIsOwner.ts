import { WorkspaceData, WorkspaceId } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import useGetWorkspaceInfo from './useGetWorkspaceInfo';

interface GetFolderParamsBase {
  signal: AbortSignal;
  apiCertificate: string;
}

interface GetFolderIdParams extends GetFolderParamsBase {
  locationId: WorkspaceId;
}

const getOwner = async ({
  signal,
  apiCertificate,
  locationId,
}: GetFolderIdParams) => {
  const url = `https://hpi-api.sabacloud.com/v1/content/?q=(content_location%3D%3D${locationId.contentLocation})&f=(folder_id)&includeDetails=true`;
  const response = await fetch(url, {
    signal,
    headers: {
      sabaCertificate: apiCertificate,
    },
  });
  
  const workspaceData: WorkspaceData = await response.json();
  const { owners } = workspaceData?.results?.[0] || [];

  return owners;
};

const useIsOwner = () => {
  const { userId, apiCertificate, workspaceUrls } = useGetWorkspaceInfo();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['owner-data'],
    queryFn: async ({ signal }) => {
      const owners = await getOwner({
        signal,
        apiCertificate,
        locationId: workspaceUrls,
      });
      

      if (owners.length && userId) {
        const isOwner = owners.some((owner) => owner.id === userId);
        return isOwner;
      }

      return false;
    },
  });

  return {
    isOwner: !!data,
    isLoadingOwner: isLoading,
    isErrorOwner: isError,
  };
};

export default useIsOwner;
