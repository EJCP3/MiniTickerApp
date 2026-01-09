import { defineStore } from 'pinia';
import { useQuery, useMutation, useQueryCache } from '@pinia/colada';
import userService from '@/services/usuarios';
import type { User } from '@/types';

export const useUserStore = defineStore('userStore', () => {
  const queryCache = useQueryCache();

  // --- QUERIES ---
  const { data: users, status, refresh } = useQuery({
    key: ['users'],
    query: () => userService.getUsers(),
  });

  // --- MUTATIONS ---
 const { mutateAsync: addUser } = useMutation({
  mutation: (userData: FormData) => userService.createUser(userData),
  onSuccess: () => queryCache.invalidateQueries({ key: ['users'] }),
});

 const { mutateAsync: updateUser } = useMutation({
  mutation: (vars: { id: string; data: FormData }) => 
    userService.updateUser(vars.id, vars.data),
  onSuccess: () => queryCache.invalidateQueries({ key: ['users'] }),
});

  const { mutateAsync: toggleStatus } = useMutation({
    mutation: (vars: { id: string; active: boolean }) => 
      userService.toggleUserStatus(vars.id, vars.active),
    onSuccess: () => queryCache.invalidateQueries({ key: ['users'] }),
  });


  return {
    users,
    status,
    refresh,
    addUser,
    updateUser,
    toggleStatus,
  };
});