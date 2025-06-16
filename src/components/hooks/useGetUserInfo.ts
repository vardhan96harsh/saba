import { useQuery } from '@tanstack/react-query';

const getUserInfo = async ({ signal }: { signal: AbortSignal }) => {
  const responseUrl = await fetch(
    `https://hpi.sabacloud.com/Saba/api/ui/torque/uicontext/currentuser`,
    {
      signal,
    }
  );

  const bodyContent = await responseUrl.json();
  const data: { userName: string; userId: string } = {
    userName: bodyContent.userInfo.fullName,
    userId: bodyContent.userInfo.userId,
  };

  return data;
};

const useGetUserInfo = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-data'],
    queryFn: async ({ signal }) => {
      const userData = await getUserInfo({
        signal,
      });

      return userData;
    },
  });

  return {
    userData: data,
    isLoadingUserInfo: isLoading,
    isErrorUserInfo: isError,
  };
};

export default useGetUserInfo;
