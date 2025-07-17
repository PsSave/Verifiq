import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://localhost:3000/api";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
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

interface ListItem {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
  image?: string;
  list_id: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface ListsResponse {
  lists: List[];
}

interface ListResponse {
  list: List;
}

interface ItemResponse {
  item: ListItem;
}

interface UserProfileResponse {
  user: User;
  stats: {
    listsCreated: number;
    itemsCompleted: number;
  };
}

interface StatsResponse {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Erro ao buscar token:", error);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();

      const config: RequestInit = {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro na requisição");
      }

      return { data };
    } catch (error) {
      console.error("Erro na API:", error);
      return {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  // Métodos de autenticação
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await this.makeRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      await AsyncStorage.setItem("authToken", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<ApiResponse> {
    return await this.makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout() {
    await AsyncStorage.multiRemove(["authToken", "user"]);
  }

  async verifyToken() {
    return await this.makeRequest("/auth/verify");
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return await this.makeRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Métodos de usuário
  async getUserProfile(): Promise<ApiResponse<UserProfileResponse>> {
    return await this.makeRequest<UserProfileResponse>("/users/profile");
  }

  async updateProfile(userData: {
    name?: string;
    email?: string;
    avatar?: string;
  }) {
    return await this.makeRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteAccount(password: string) {
    return await this.makeRequest("/users/account", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    });
  }

  async exportData() {
    return await this.makeRequest("/users/export");
  }

  // Métodos de listas
  async getLists(): Promise<ApiResponse<ListsResponse>> {
    return await this.makeRequest<ListsResponse>("/lists");
  }

  async getListById(id: string): Promise<ApiResponse<ListResponse>> {
    return await this.makeRequest<ListResponse>(`/lists/${id}`);
  }

  async createList(listData: {
    name: string;
    description?: string;
    isIndividual: boolean;
  }): Promise<ApiResponse<ListResponse>> {
    return await this.makeRequest<ListResponse>("/lists", {
      method: "POST",
      body: JSON.stringify(listData),
    });
  }

  async updateList(
    id: string,
    listData: { name?: string; description?: string }
  ) {
    return await this.makeRequest(`/lists/${id}`, {
      method: "PUT",
      body: JSON.stringify(listData),
    });
  }

  async deleteList(id: string) {
    return await this.makeRequest(`/lists/${id}`, {
      method: "DELETE",
    });
  }

  async shareList(
    id: string,
    email: string,
    permission: "read" | "write" | "admin"
  ) {
    return await this.makeRequest(`/lists/${id}/share`, {
      method: "POST",
      body: JSON.stringify({ email, permission }),
    });
  }

  async getSharedUsers(id: string) {
    return await this.makeRequest(`/lists/${id}/shared-users`);
  }

  async removeShare(listId: string, userId: string) {
    return await this.makeRequest(`/lists/${listId}/share/${userId}`, {
      method: "DELETE",
    });
  }

  // Métodos de itens
  async getListItems(listId: string) {
    return await this.makeRequest(`/items/list/${listId}`);
  }

  async createItem(
    listId: string,
    itemData: { name: string; description?: string; image?: string }
  ): Promise<ApiResponse<ItemResponse>> {
    return await this.makeRequest<ItemResponse>(`/items/list/${listId}`, {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  }

  async updateItem(
    id: string,
    itemData: {
      name?: string;
      description?: string;
      image?: string;
      completed?: boolean;
    }
  ) {
    return await this.makeRequest(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
  }

  async toggleItemCompleted(id: string) {
    return await this.makeRequest(`/items/${id}/toggle`, {
      method: "PATCH",
    });
  }

  async deleteItem(id: string) {
    return await this.makeRequest(`/items/${id}`, {
      method: "DELETE",
    });
  }

  async getListStats(listId: string): Promise<ApiResponse<StatsResponse>> {
    return await this.makeRequest<StatsResponse>(`/items/list/${listId}/stats`);
  }

  // Método para verificar status da API
  async healthCheck() {
    return await this.makeRequest("/health");
  }
}

export const apiService = new ApiService();
export default apiService;
