import { AudienceResponse } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import useGetWorkspaceInfo from './useGetWorkspaceInfo';

const useIsPartner = () => {
  const { userId, apiCertificate } = useGetWorkspaceInfo();
  const audienceUrl = `https://hpi-api.sabacloud.com/v1/common/profile/${userId}/audiencetype`;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['audienceType'],
    queryFn: async ({ signal }) => {
      const response = await fetch(audienceUrl, {
        signal,
        headers: {
          sabaCertificate: apiCertificate,
        },
      });

      const audienceData: AudienceResponse = await response.json();

      if (audienceData.results?.length) {
        const audienceType = audienceData.results.find((audience) =>
          audience.displayName.includes('Partner_Programs')
        );

        if (audienceType) {
          return true;
        }
      }

      return false;
    },
  });

  return {
    isPartner: !!data,
    isLoadingPartner: isLoading,
    isErrorPartner: isError,
  };
};

export default useIsPartner;
