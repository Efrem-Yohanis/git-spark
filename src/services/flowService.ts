import { useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flow interfaces based on the API documentation
export interface FlowNode {
  id: string;
  order: number;
  node: {
    id: string;
    name: string;
    subnodes: Subnode[];
  };
  selected_subnode?: {
    id: string;
    name: string;
    parameter_values: ParameterValue[];
  };
  outgoing_edges?: Edge[];
}

export interface Subnode {
  id: string;
  name: string;
  parameters: Parameter[];
  is_selected: boolean;
}

export interface Parameter {
  key: string;
  default_value: string;
}

export interface ParameterValue {
  parameter_key: string;
  value: string;
}

export interface Edge {
  id: string;
  from_node: string;
  to_node: string;
  condition?: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  is_deployed: boolean;
  is_running: boolean;
  flow_nodes: FlowNode[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface DeployedNode {
  id: string;
  name: string;
  subnodes: Subnode[];
}

// Mock data for deployed nodes
const mockDeployedNodes: DeployedNode[] = [
  {
    id: 'node-1',
    name: 'SFTP Collector Node',
    subnodes: [
      { id: 'sub1', name: 'Connection Handler', parameters: [], is_selected: true },
      { id: 'sub2', name: 'File Scanner', parameters: [], is_selected: false },
    ]
  },
  {
    id: 'node-2', 
    name: 'ASN.1 Decoder Node',
    subnodes: [
      { id: 'sub3', name: 'Schema Loader', parameters: [], is_selected: true },
      { id: 'sub4', name: 'Data Parser', parameters: [], is_selected: false },
    ]
  },
  {
    id: 'node-3',
    name: 'Validation BLN Node', 
    subnodes: [
      { id: 'sub5', name: 'Rule Engine', parameters: [], is_selected: true },
      { id: 'sub6', name: 'Quality Check', parameters: [], is_selected: false },
    ]
  }
];

// API Service Functions
export const flowService = {
  // Create a new flow
  async createFlow(data: { name: string; description: string }): Promise<Flow> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    const newFlow: Flow = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      is_deployed: false,
      is_running: false,
      flow_nodes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'user'
    };
    return newFlow;
  },

  // Get deployed nodes for flow editor
  async getDeployedNodes(): Promise<DeployedNode[]> {
    // Mock implementation - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockDeployedNodes];
  },

  // Add node to flow
  async addNodeToFlow(data: { flow: string; node: string; order: number }): Promise<FlowNode> {
    // Mock implementation - simulate successful addition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const deployedNode = mockDeployedNodes.find(n => n.id === data.node);
    if (!deployedNode) {
      throw new Error('Node not found');
    }
    
    const newFlowNode: FlowNode = {
      id: `flow-node-${Date.now()}`,
      order: data.order,
      node: {
        id: deployedNode.id,
        name: deployedNode.name,
        subnodes: deployedNode.subnodes
      },
      selected_subnode: deployedNode.subnodes.find(s => s.is_selected) ? {
        id: deployedNode.subnodes.find(s => s.is_selected)!.id,
        name: deployedNode.subnodes.find(s => s.is_selected)!.name,
        parameter_values: []
      } : undefined,
      outgoing_edges: []
    };
    
    console.log('Successfully added node to flow:', newFlowNode);
    return newFlowNode;
  },

  // Get flow details
  async getFlow(id: string): Promise<Flow> {
    const response = await axiosInstance.get(`flows/${id}/`);
    return response.data;
  },

  // Update flow
  async updateFlow(id: string, data: Partial<Flow>): Promise<Flow> {
    const response = await axiosInstance.put(`flows/${id}/`, data);
    return response.data;
  },

  // Start flow
  async startFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/start/`);
    return response.data;
  },

  // Stop flow
  async stopFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/stop/`);
    return response.data;
  },

  // Deploy flow
  async deployFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/deploy/`);
    return response.data;
  },

  // Undeploy flow
  async undeployFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/undeploy/`);
    return response.data;
  },

  // Update node connection (from_node field)
  async updateNodeConnection(flowNodeId: string, fromNodeId: string | null): Promise<FlowNode> {
    const response = await axiosInstance.patch(`flownode/${flowNodeId}/`, {
      from_node: fromNodeId
    });
    return response.data;
  },
};

// Custom hook for deployed nodes
export const useDeployedNodes = () => {
  const [data, setData] = useState<DeployedNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNodes = async () => {
      try {
        console.log('Loading deployed nodes from API...');
        const nodes = await flowService.getDeployedNodes();
        console.log('Deployed nodes loaded successfully:', nodes);
        setData(nodes);
        setError(null);
      } catch (err: any) {
        console.error('Error loading deployed nodes:', err);
        setError(err.response?.data?.error || err.message || 'Error fetching deployed nodes');
      } finally {
        setLoading(false);
      }
    };

    loadNodes();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const nodes = await flowService.getDeployedNodes();
      setData(nodes);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching deployed nodes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook for single flow
export const useFlow = (id: string) => {
  const [data, setData] = useState<Flow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadFlow = async () => {
      try {
        setLoading(true);
        const flow = await flowService.getFlow(id);
        setData(flow);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching flow');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFlow();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const flow = await flowService.getFlow(id);
      setData(flow);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching flow');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};