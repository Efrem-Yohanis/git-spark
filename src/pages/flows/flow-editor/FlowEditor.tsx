import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  Position,
  Handle,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Database, 
  Filter, 
  CheckCircle, 
  AlertCircle,
  RotateCcw,
  Activity,
  Play,
  Save,
  Plus,
  FileText,
  Globe,
  Edit,
  Settings,
  List,
  Download,
  Upload,
  Rocket,
  Grid2X2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NodeConfigDialog } from '@/components/NodeConfigDialog';
import { NodePalette } from './NodePalette';
import { useFlow, flowService } from '@/services/flowService';

interface NodeData extends Record<string, unknown> {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  config?: Record<string, any>;
  connector?: string;
  connectorOptions?: string[];
}

interface CustomNodeProps {
  data: NodeData;
  id: string;
}

interface StreamFlow {
  id: string;
  name: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
  isRunning?: boolean;
  isDeployed?: boolean;
  deployedAt?: string;
}

// Connector options for different node types
const connectorOptions = {
  sftp_collector: ['SFTP Server 1', 'SFTP Server 2', 'SFTP Server 3'],
  fdc: ['FDC Standard', 'FDC Advanced', 'FDC Custom'],
  asn1_decoder: ['ASN.1 Standard', 'ASN.1 BER', 'ASN.1 PER'],
  ascii_decoder: ['ASCII Standard', 'ASCII UTF-8', 'ASCII Custom'],
  validation_bln: ['Validation Basic', 'Validation Advanced', 'Validation Custom'],
  enrichment_bln: ['Enrichment Standard', 'Enrichment CRM', 'Enrichment DWH'],
  encoder: ['CSV Encoder', 'JSON Encoder', 'XML Encoder'],
  diameter_interface: ['Diameter RO', 'Diameter Gy', 'Diameter Gz'],
  raw_backup: ['Local Backup', 'Remote Backup', 'Cloud Backup'],
};

export function FlowEditor() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: flowId } = useParams();
  const [activeView, setActiveView] = useState<'flows' | 'create'>('create');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Fetch flow data if editing existing flow
  const { data: flowData, loading: flowLoading, error: flowError } = useFlow(flowId || '');
  
  // Initialize with empty flow for new flows
  const [currentFlow, setCurrentFlow] = useState<StreamFlow>({
    id: flowId || `flow-${Date.now()}`,
    name: 'New Flow',
    nodes: [],
    edges: [],
    isRunning: false,
    isDeployed: false,
  });
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editingNode, setEditingNode] = useState<string | null>(null);

  // Update flow data when loaded from API
  useEffect(() => {
    if (flowData && flowId) {
      setCurrentFlow({
        id: flowData.id,
        name: flowData.name,
        nodes: [], // We'll convert flow_nodes to canvas nodes if needed
        edges: [], // We'll convert edges if needed
        isRunning: flowData.is_running,
        isDeployed: flowData.is_deployed,
      });
      // For now, start with empty canvas - we can add conversion logic later
      setNodes([]);
      setEdges([]);
    }
  }, [flowData, flowId, setNodes, setEdges]);

  const [flows, setFlows] = useState<StreamFlow[]>([]);

  // Update current flow when nodes or edges change
  const updateCurrentFlow = useCallback(() => {
    setFlows(prev => prev.map(flow => 
      flow.id === currentFlow.id 
        ? { ...flow, nodes, edges }
        : flow
    ));
  }, [currentFlow.id, nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle connector selection
  const handleConnectorChange = useCallback((nodeId: string, connector: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                connector,
              },
            }
          : node
      )
    );
  }, [setNodes]);

  // Add node to canvas from API data
  const addNodeToCanvas = async (nodeId: string) => {
    try {
      // Create a visual node for the canvas
      const newNode: Node<NodeData> = {
        id: `canvas-node-${Date.now()}`,
        type: 'custom',
        position: { x: Math.random() * 300 + 200, y: Math.random() * 200 + 150 },
        data: {
          label: `Node ${nodeId}`,
          icon: Database,
          description: 'Deployed node from API',
          config: {},
          connector: 'Default',
          connectorOptions: ['Default']
        },
      };
      setNodes((prev) => [...prev, newNode]);

      // Add to flow via API
      if (flowId) {
        await flowService.addNodeToFlow({
          flow: flowId,
          node: nodeId,
          order: nodes.length + 1
        });
        
        toast({
          title: "Node Added",
          description: "Node has been added to the flow successfully.",
        });
      }
    } catch (error) {
      console.error('Error adding node to flow:', error);
      toast({
        title: "Error",
        description: "Failed to add node to flow.",
        variant: "destructive"
      });
    }
  };

  const createNewFlow = () => {
    const newFlow: StreamFlow = {
      id: `flow-${Date.now()}`,
      name: `New Flow ${flows.length + 1}`,
      nodes: [],
      edges: [],
      isRunning: false,
      isDeployed: false,
    };
    setFlows(prev => [...prev, newFlow]);
    setCurrentFlow(newFlow);
    setNodes([]);
    setEdges([]);
    setActiveView('create');
  };

  const selectFlow = (flow: StreamFlow) => {
    updateCurrentFlow();
    setCurrentFlow(flow);
    setNodes(flow.nodes);
    setEdges(flow.edges);
    setActiveView('create');
  };

  const startPipeline = (flowId: string) => {
    setFlows(prev => prev.map(flow => 
      flow.id === flowId 
        ? { ...flow, isRunning: !flow.isRunning }
        : flow
    ));
  };

  const deployFlow = (flowId: string) => {
    setFlows(prev => prev.map(flow => 
      flow.id === flowId 
        ? { 
            ...flow, 
            isDeployed: !flow.isDeployed,
            deployedAt: !flow.isDeployed ? new Date().toISOString() : undefined
          }
        : flow
    ));
    
    const flow = flows.find(f => f.id === flowId);
    if (flow) {
      toast({
        title: flow.isDeployed ? "Flow Undeployed" : "Flow Deployed",
        description: flow.isDeployed 
          ? `${flow.name} has been undeployed successfully.`
          : `${flow.name} has been deployed successfully.`,
      });
    }
  };

  const exportFlowAsJSON = () => {
    const exportData = {
      flow: {
        id: currentFlow.id,
        name: currentFlow.name,
        created: new Date().toISOString(),
        version: '1.0.0'
      },
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        label: (node.data as NodeData).label,
        description: (node.data as NodeData).description,
        config: (node.data as NodeData).config || {},
        connector: (node.data as NodeData).connector,
        parameters: {
          ...(node.data as NodeData).config,
          connector: (node.data as NodeData).connector
        }
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'default'
      })),
      metadata: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        exportedAt: new Date().toISOString()
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentFlow.name.replace(/\s+/g, '_')}_flow.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Flow Exported",
      description: `${currentFlow.name} has been exported as JSON successfully.`,
    });
  };

  const importFlow = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            const newFlow: StreamFlow = {
              id: `imported-${Date.now()}`,
              name: `Imported ${importedData.flow?.name || 'Flow'}`,
              isRunning: false,
              isDeployed: false,
              nodes: importedData.nodes?.map((node: any) => ({
                id: node.id,
                type: node.type || 'custom',
                position: node.position,
                data: {
                  label: node.label,
                  icon: Database, // Default icon since availableModules is no longer used
                  description: node.description,
                  config: node.config || {},
                  connector: node.connector,
                  connectorOptions: node.connectorOptions || ['Default']
                }
              })) || [],
              edges: importedData.edges || []
            };
            setFlows(prev => [...prev, newFlow]);
            toast({
              title: "Flow Imported",
              description: `${newFlow.name} has been imported successfully.`,
            });
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Invalid JSON file format.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const saveFlow = () => {
    updateCurrentFlow();
    toast({
      title: "Flow Saved",
      description: `${currentFlow.name} has been saved successfully.`,
    });
    setActiveView('flows');
  };

  // Handle node configuration editing
  const handleNodeEdit = (nodeId: string) => {
    setEditingNode(nodeId);
  };

  const updateNodeConfig = (nodeId: string, config: Record<string, any>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                config,
              },
            }
          : node
      )
    );
    setEditingNode(null);
  };

  const CustomNode = ({ data, id }: CustomNodeProps) => {
    const Icon = data.icon;
    const isEditing = editingNode === id;
    
    return (
      <div className="bg-node-background border-2 border-node-border rounded-lg p-3 shadow-node min-w-48">
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-edge-default border-2 border-background"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 !bg-edge-default border-2 border-background"
        />
        
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{data.label}</span>
          </div>
          <Button
            onClick={() => handleNodeEdit(id)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">{data.description}</p>
        
        {data.connectorOptions && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Connector:</label>
            <Select
              value={data.connector || ''}
              onValueChange={(value) => handleConnectorChange(id, value)}
            >
              <SelectTrigger className="h-7 text-xs bg-background border-input">
                <SelectValue placeholder="Select connector" />
              </SelectTrigger>
              <SelectContent className="bg-background border-input shadow-lg z-50">
                {data.connectorOptions.map((option) => (
                  <SelectItem key={option} value={option} className="text-xs hover:bg-muted">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Additional Configuration Fields */}
        {data.config && Object.keys(data.config).length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <div className="text-xs font-medium text-foreground mb-1">Configuration:</div>
            <div className="space-y-1">
              {Object.entries(data.config).map(([key, value]) => (
                <div key={key} className="text-xs text-muted-foreground">
                  <span className="font-medium">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Node Configuration Edit Dialog */}
        {isEditing && (
          <NodeConfigDialog
            nodeId={id}
            nodeData={data}
            isOpen={isEditing}
            onClose={() => setEditingNode(null)}
            onSave={updateNodeConfig}
          />
        )}
      </div>
    );
  };

  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
  }), []);

  if (activeView === 'flows') {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Flow Management
              </div>
              <div className="flex items-center gap-2">
                <div className="flex border border-border rounded-md">
                  <Button
                    onClick={() => setViewMode('grid')}
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-r-none"
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={importFlow} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Flow
                </Button>
                <Button onClick={createNewFlow} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Flow
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flows.map((flow) => (
                  <Card key={flow.id} className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-foreground text-sm flex items-center justify-between">
                        {flow.name}
                        <div className="flex gap-1">
                          <Badge variant={flow.isRunning ? "default" : "secondary"}>
                            {flow.isRunning ? 'Running' : 'Stopped'}
                          </Badge>
                          {flow.isDeployed && (
                            <Badge variant="outline" className="text-accent-foreground border-accent">
                              Deployed
                            </Badge>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-muted-foreground">
                          <span className="font-medium">Modules:</span> {flow.nodes.length}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium">Connections:</span> {flow.edges.length}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Status:</span>
                          <Badge variant={flow.isRunning ? "default" : "secondary"} className="ml-2 text-xs">
                            {flow.isRunning ? 'Running' : 'Stopped'}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Deployment:</span>
                          {flow.isDeployed ? (
                            <div className="mt-1">
                              <Badge variant="outline" className="text-accent-foreground border-accent text-xs">
                                Deployed
                              </Badge>
                              {flow.deployedAt && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {new Date(flow.deployedAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="ml-2 text-muted-foreground">Not deployed</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-border">
                        <div className="text-xs font-medium text-foreground mb-2">Actions:</div>
                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            onClick={() => selectFlow(flow)} 
                            variant="outline" 
                            size="sm"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            onClick={() => startPipeline(flow.id)}
                            variant={flow.isRunning ? "destructive" : "default"}
                            size="sm"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {flow.isRunning ? 'Stop' : 'Start'}
                          </Button>
                          <Button 
                            onClick={() => deployFlow(flow.id)}
                            variant={flow.isDeployed ? "outline" : "default"}
                            size="sm"
                          >
                            <Rocket className="h-3 w-3 mr-1" />
                            {flow.isDeployed ? 'Undeploy' : 'Deploy'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Modules</TableHead>
                    <TableHead className="text-muted-foreground">Connections</TableHead>
                    <TableHead className="text-muted-foreground">Deployed</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flows.map((flow) => (
                    <TableRow key={flow.id} className="border-border">
                      <TableCell className="text-foreground font-medium">{flow.name}</TableCell>
                      <TableCell>
                        <Badge variant={flow.isRunning ? "default" : "secondary"}>
                          {flow.isRunning ? 'Running' : 'Stopped'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{flow.nodes.length}</TableCell>
                      <TableCell className="text-muted-foreground">{flow.edges.length}</TableCell>
                      <TableCell>
                        {flow.isDeployed ? (
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-accent-foreground border-accent">
                              Deployed
                            </Badge>
                            {flow.deployedAt && (
                              <div className="text-xs text-muted-foreground">
                                {new Date(flow.deployedAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not deployed</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => selectFlow(flow)} 
                            variant="outline" 
                            size="sm"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            onClick={() => startPipeline(flow.id)}
                            variant={flow.isRunning ? "destructive" : "default"}
                            size="sm"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {flow.isRunning ? 'Stop' : 'Start'}
                          </Button>
                          <Button 
                            onClick={() => deployFlow(flow.id)}
                            variant={flow.isDeployed ? "outline" : "default"}
                            size="sm"
                          >
                            <Rocket className="h-3 w-3 mr-1" />
                            {flow.isDeployed ? 'Undeploy' : 'Deploy'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create/Edit Flow View
  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Flow Creator - {currentFlow.name}
            </div>
            <div className="flex gap-2">
              <Button onClick={exportFlowAsJSON} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button onClick={saveFlow} variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Flow
              </Button>
              <Button 
                onClick={() => navigate('/flows')} 
                variant="outline"
              >
                Back to Flows
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <NodePalette onAddNode={addNodeToCanvas} />
            </div>

            <div className="lg:col-span-3">
              <div className="h-96 bg-muted rounded-lg border border-border">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  fitView
                  className="bg-muted"
                  connectionMode={'loose' as ConnectionMode}
                  snapToGrid={true}
                  snapGrid={[15, 15]}
                >
                  <Controls className="bg-background border-border text-foreground" />
                  <MiniMap className="bg-background border-border" />
                  <Background color="hsl(var(--border))" />
                </ReactFlow>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="text-foreground text-sm font-medium mb-2">Current Flow: {currentFlow.name}</h4>
            <div className="flex gap-2 flex-wrap">
              {nodes.map((node) => (
                <Badge key={node.id} variant="outline" className="text-xs">
                  {(node.data as NodeData).label} ({(node.data as NodeData).connector})
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}