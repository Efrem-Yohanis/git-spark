import { useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces based on API response
export interface SubnodeListItem {
  id: string;
  version: number;
  created_at: string;
  updated_at: string;
  last_updated_by: string | null;
  last_updated_at: string;
  name: string;
  is_selected: boolean;
  node: string;
  is_deployed?: boolean;
}

export interface SubnodeDetail {
  id: string;
  version: number;
  created_at: string;
  updated_at: string;
  last_updated_by: string | null;
  last_updated_at: string;
  name: string;
  is_selected: boolean;
  node: string;
  is_deployed?: boolean;
  version_comment?: string;
  created_by?: string;
}

export interface SubnodeVersion {
  id: string;
  version: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  description?: string;
  version_comment?: string;
}

export interface CreateSubnodeRequest {
  version?: number | null;
  created_by?: string;
  last_updated_by?: string;
  version_comment?: string;
  name: string;
  is_selected?: boolean;
  node: string | null;
}

export interface ParameterValueRequest {
  parameter_id: string;
  value: string;
}

export interface ParameterValueResponse {
  id: string;
  parameter: string;
  subnode: string;
  value: string;
  last_updated_by: string;
  last_updated_at: string;
}

export interface ActivateVersionRequest {
  version: number;
}

export interface CloneSubnodeRequest {
  name?: string;
  [key: string]: any;
}

export interface CreateEditableVersionRequest {
  version_comment: string;
}

export interface EditVersionRequest {
  description?: string;
  parameters?: { [key: string]: string };
  version_comment?: string;
}

// API Service Functions
export const subnodeService = {
  // List all subnodes
  async getAllSubnodes(): Promise<SubnodeListItem[]> {
    const response = await axiosInstance.get('subnodes/');
    return response.data;
  },

  // Get single subnode detail
  async getSubnode(id: string): Promise<SubnodeDetail> {
    const response = await axiosInstance.get(`subnodes/${id}/`);
    return response.data;
  },

  // Update subnode (PATCH)
  async updateSubnode(id: string, data: Partial<SubnodeDetail>): Promise<SubnodeDetail> {
    const response = await axiosInstance.patch(`subnodes/${id}/`, data);
    return response.data;
  },

  // Delete subnode (all versions)
  async deleteSubnode(id: string): Promise<{ detail: string }> {
    const response = await axiosInstance.delete(`subnodes/${id}/`);
    return response.data;
  },

  // Create new subnode
  async createSubnode(data: CreateSubnodeRequest): Promise<SubnodeDetail> {
    const response = await axiosInstance.post('subnodes/', data);
    return response.data;
  },

  // Update parameter value in subnode
  async updateParameterValue(subnodeId: string, parameterData: ParameterValueRequest): Promise<ParameterValueResponse> {
    const response = await axiosInstance.post(`subnodes/${subnodeId}/parameter_values/`, parameterData);
    return response.data;
  },

  // Deploy subnode
  async deploySubnode(id: string): Promise<{ detail: string }> {
    const response = await axiosInstance.post(`subnodes/${id}/deploy/`);
    return response.data;
  },

  // Undeploy subnode
  async undeploySubnode(id: string): Promise<{ detail: string }> {
    const response = await axiosInstance.post(`subnodes/${id}/undeploy/`);
    return response.data;
  },

  // List all versions
  async getSubnodeVersions(id: string): Promise<SubnodeVersion[]> {
    const response = await axiosInstance.get(`subnodes/${id}/versions/`);
    return response.data;
  },

  // Create editable version from active
  async createEditableVersion(id: string, data: CreateEditableVersionRequest): Promise<{ id: string; version: number; is_deployed: boolean; message: string }> {
    const response = await axiosInstance.post(`subnodes/${id}/create_editable_version/`, data);
    return response.data;
  },

  // Edit version
  async editVersion(id: string, version: number, data: EditVersionRequest): Promise<SubnodeDetail> {
    const response = await axiosInstance.patch(`subnodes/${id}/edit_version/${version}/`, data);
    return response.data;
  },

  // Activate/Deploy specific version
  async activateVersion(id: string, version: number): Promise<{ id: string; name: string; is_deployed: boolean; version: number; message: string }> {
    const response = await axiosInstance.post(`subnodes/${id}/activate_version/${version}/`);
    return response.data;
  },

  // Undeploy specific version
  async undeployVersion(id: string, version: number): Promise<{ message: string }> {
    const response = await axiosInstance.post(`subnodes/${id}/undeploy_version/${version}/`);
    return response.data;
  },

  // Export subnode
  async exportSubnode(id: string): Promise<any> {
    const response = await axiosInstance.get(`subnodes/${id}/export/`);
    return response.data;
  },

  // Import subnode
  async importSubnode(data: any): Promise<SubnodeDetail> {
    const response = await axiosInstance.post('subnodes/import/', data);
    return response.data;
  },

  // Clone subnode
  async cloneSubnode(id: string, data?: CloneSubnodeRequest): Promise<SubnodeDetail> {
    const response = await axiosInstance.post(`subnodes/${id}/clone/`, data || {});
    return response.data;
  },

  // Delete specific version
  async deleteSubnodeVersion(id: string, version: number): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`subnodes/${id}/delete_version/${version}/`);
    return response.data;
  },

  // Delete all versions
  async deleteAllVersions(id: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`subnodes/${id}/delete_all_versions/`);
    return response.data;
  },
};

// Custom hook for fetching all subnodes
export const useSubnodes = () => {
  const [data, setData] = useState<SubnodeListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubnodes = async () => {
      try {
        const subnodes = await subnodeService.getAllSubnodes();
        setData(subnodes);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching subnodes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSubnodes();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const subnodes = await subnodeService.getAllSubnodes();
      setData(subnodes);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching subnodes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook for fetching single subnode
export const useSubnode = (id: string) => {
  const [data, setData] = useState<SubnodeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadSubnode = async () => {
      try {
        setLoading(true);
        const subnode = await subnodeService.getSubnode(id);
        setData(subnode);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching subnode');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSubnode();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const subnode = await subnodeService.getSubnode(id);
      setData(subnode);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching subnode');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook for fetching subnode versions
export const useSubnodeVersions = (id: string) => {
  const [data, setData] = useState<SubnodeVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadVersions = async () => {
      try {
        setLoading(true);
        const versions = await subnodeService.getSubnodeVersions(id);
        setData(versions);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching subnode versions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadVersions();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const versions = await subnodeService.getSubnodeVersions(id);
      setData(versions);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching subnode versions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};