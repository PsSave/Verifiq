import { useCallback, useEffect, useState } from "react";
import { apiService } from "../services/apiService";

interface ListItem {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
  image?: string;
  created_at: string;
  updated_at: string;
}

interface ListStats {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
}

interface List {
  id: number;
  name: string;
  description?: string;
  is_individual: boolean;
  created_by: number;
  creator_name: string;
  user_permission: string;
  stats?: ListStats;
  items?: ListItem[];
}

export const useLists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getLists();

      if (response.data?.lists) {
        setLists(response.data.lists);
      } else {
        setError(response.error || "Erro ao carregar listas");
      }
    } catch (err) {
      setError("Erro ao carregar listas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createList = async (listData: {
    name: string;
    description?: string;
    isIndividual: boolean;
  }) => {
    try {
      setError(null);
      const response = await apiService.createList(listData);

      if (response.data?.list) {
        await fetchLists(); // Recarregar listas
        return { success: true, list: response.data.list };
      } else {
        setError(response.error || "Erro ao criar lista");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Erro ao criar lista";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updateList = async (
    id: string,
    listData: { name?: string; description?: string }
  ) => {
    try {
      setError(null);
      const response = await apiService.updateList(id, listData);

      if (response.data) {
        await fetchLists(); // Recarregar listas
        return { success: true };
      } else {
        setError(response.error || "Erro ao atualizar lista");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Erro ao atualizar lista";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const deleteList = async (id: string) => {
    try {
      setError(null);
      const response = await apiService.deleteList(id);

      if (response.data) {
        await fetchLists(); // Recarregar listas
        return { success: true };
      } else {
        setError(response.error || "Erro ao deletar lista");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Erro ao deletar lista";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const shareList = async (
    id: string,
    email: string,
    permission: "read" | "write" | "admin"
  ) => {
    try {
      setError(null);
      const response = await apiService.shareList(id, email, permission);

      if (response.data) {
        return { success: true };
      } else {
        setError(response.error || "Erro ao compartilhar lista");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Erro ao compartilhar lista";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return {
    lists,
    isLoading,
    error,
    refetch: fetchLists,
    createList,
    updateList,
    deleteList,
    shareList,
  };
};

export const useListDetails = (listId: string) => {
  const [list, setList] = useState<List | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListDetails = useCallback(async () => {
    if (!listId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getListById(listId);

      if (response.data?.list) {
        setList(response.data.list);
        setItems(response.data.list.items || []);
      } else {
        setError(response.error || "Erro ao carregar detalhes da lista");
      }
    } catch (err) {
      setError("Erro ao carregar detalhes da lista");
    } finally {
      setIsLoading(false);
    }
  }, [listId]);

  const createItem = async (itemData: {
    name: string;
    description?: string;
    image?: string;
  }) => {
    try {
      setError(null);
      const response = await apiService.createItem(listId, itemData);

      if (response.data?.item) {
        await fetchListDetails(); // Recarregar lista
        return { success: true, item: response.data.item };
      } else {
        setError(response.error || "Erro ao criar item");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Erro ao criar item";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updateItem = async (
    itemId: string,
    itemData: {
      name?: string;
      description?: string;
      image?: string;
      completed?: boolean;
    }
  ) => {
    try {
      setError(null);
      const response = await apiService.updateItem(itemId, itemData);

      if (response.data) {
        await fetchListDetails(); // Recarregar lista
        return { success: true };
      } else {
        setError(response.error || "Erro ao atualizar item");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Erro ao atualizar item";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const toggleItemCompleted = async (itemId: string) => {
    try {
      setError(null);
      const response = await apiService.toggleItemCompleted(itemId);

      if (response.data) {
        await fetchListDetails(); // Recarregar lista
        return { success: true };
      } else {
        setError(response.error || "Erro ao alterar status do item");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Erro ao alterar status do item";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      setError(null);
      const response = await apiService.deleteItem(itemId);

      if (response.data) {
        await fetchListDetails(); // Recarregar lista
        return { success: true };
      } else {
        setError(response.error || "Erro ao deletar item");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Erro ao deletar item";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  useEffect(() => {
    fetchListDetails();
  }, [fetchListDetails]);

  return {
    list,
    items,
    isLoading,
    error,
    refetch: fetchListDetails,
    createItem,
    updateItem,
    toggleItemCompleted,
    deleteItem,
  };
};
