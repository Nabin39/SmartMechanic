import { useAuth } from '../context/AuthContext';

export function useIsMechanic(): boolean {
  return useAuth().profile?.role === 'mechanic';
}
