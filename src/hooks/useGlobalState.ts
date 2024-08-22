import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from 'react';

type GlobalStateKey = string | readonly string[];
type SetData<T> = (data: T | ((previousData: T) => T)) => void;

export const useGlobalState = <T>(
  key: GlobalStateKey,
  initialData?: T,
  options: { enabled?: boolean } = {}
) => {
  const queryClient = useQueryClient();
  const getKey = useCallback((key: GlobalStateKey) => 
    Array.isArray(key) ? ['global', ...key] : ['global', key], []);

  const { data, refetch: reset, dataUpdatedAt } = useQuery({
    queryKey: getKey(key),
    queryFn: () => Promise.resolve(initialData),
    initialData,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    networkMode: 'always',
    enabled: options.enabled ?? true,
  });

  const setData: SetData<T> = useCallback((arg) => {
    queryClient.setQueryData(getKey(key), (oldData: T | undefined) => {
      if (typeof arg === 'function') {
        return (arg as ((prev: T | null) => T))(oldData ?? null);
      }
      return arg;
    });
  }, [queryClient, getKey, key]);

  const removeData = useCallback(() => {
    queryClient.removeQueries({ queryKey: getKey(key) });
  }, [queryClient, getKey, key]);

  return [data as T, setData, reset, removeData, dataUpdatedAt] as const;
}