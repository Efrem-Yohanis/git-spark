import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Upload, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nodeService, type Node, type NodeVersion } from "@/services/nodeService";

interface NodeParameter {
  id: string;
  key: string;
  datatype: string;
  default_value?: string;
  is_active?: boolean;
}

interface SubNodeParameter {
  id: string;
  nodeParameterId: string;
  value: string;
}

interface SubNode {
  id: string;
  name: string;
  scriptName: string;
  isDeployed: boolean;
  parameters: SubNodeParameter[];
}

// Mock existing node data
const mockNode = {
  id: "1",
  name: "Database Source",
  scriptName: "db_source.py",
  executableScript: "",
  useScriptName: true,
  parameters: [
    { id: "1", key: "timeout", valueType: "Integer" },
    { id: "2", key: "database_url", valueType: "String" }
  ],
  subNodes: [
    {
      id: "1",
      name: "Validation Subnode",
      scriptName: "validate.py",
      isDeployed: true,
      parameters: [
        { id: "1", nodeParameterId: "1", value: "30" },
        { id: "2", nodeParameterId: "2", value: "postgresql://localhost:5432/db" }
      ]
    }
  ]
};

export function EditNodePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const version = searchParams.get('version');
  
  const [loading, setLoading] = useState(true);
  const [node, setNode] = useState<Node | null>(null);
  const [versionData, setVersionData] = useState<NodeVersion | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [description, setDescription] = useState("");
  const [scriptName, setScriptName] = useState("");
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [nodeParameters, setNodeParameters] = useState<NodeParameter[]>([]);
  const [subNodes, setSubNodes] = useState<SubNode[]>([]);

  useEffect(() => {
    const loadNodeAndVersion = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Load node data
        const nodeData = await nodeService.getNode(id);
        setNode(nodeData);
        setNodeName(nodeData.name);
        setDescription(nodeData.description || "");
        
        if (version) {
          // Load specific version data
          const versionResponse = await nodeService.getNodeVersion(id, parseInt(version));
          const versionDetails = Array.isArray(versionResponse) ? versionResponse[0] : versionResponse;
          const actualVersion = versionDetails.versions?.[0] || versionDetails;
          
          setVersionData(actualVersion);
          setScriptName(actualVersion.script || "");
           setNodeParameters(actualVersion.parameters || []);
           // Map subnodes to match our interface
           const mappedSubnodes = (actualVersion.subnodes || []).map((subnode: any) => ({
             id: subnode.id,
             name: subnode.name,
             scriptName: subnode.script || "",
             isDeployed: subnode.is_deployed || false,
             parameters: subnode.parameter_values || []
           }));
           setSubNodes(mappedSubnodes);
         } else {
           // Use current node data
           const activeVersion = nodeData.versions.find(v => v.is_deployed) || nodeData.versions[0];
           if (activeVersion) {
             setVersionData(activeVersion);
             setScriptName(activeVersion.script || nodeData.script || "");
             setNodeParameters(activeVersion.parameters || []);
             // Map subnodes to match our interface
             const mappedSubnodes = (activeVersion.subnodes || []).map((subnode: any) => ({
               id: subnode.id,
               name: subnode.name,
               scriptName: subnode.script || "",
               isDeployed: subnode.is_deployed || false,
               parameters: subnode.parameter_values || []
             }));
             setSubNodes(mappedSubnodes);
           }
        }
      } catch (error) {
        console.error("Error loading node/version data:", error);
        toast({
          title: "Error",
          description: "Failed to load node data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadNodeAndVersion();
  }, [id, version, toast]);

  const addParameter = () => {
    const newParam: NodeParameter = {
      id: Date.now().toString(),
      key: "",
      datatype: "String",
      default_value: "",
      is_active: true
    };
    setNodeParameters([...nodeParameters, newParam]);
  };

  const removeParameter = (paramId: string) => {
    setNodeParameters(nodeParameters.filter(p => p.id !== paramId));
    // Remove parameter from all subnodes
    setSubNodes(subNodes.map(subnode => ({
      ...subnode,
      parameters: subnode.parameters.filter(p => p.nodeParameterId !== paramId)
    })));
  };

  const updateParameter = (paramId: string, field: keyof NodeParameter, value: string | boolean) => {
    setNodeParameters(nodeParameters.map(p => 
      p.id === paramId ? { ...p, [field]: value } : p
    ));
  };

  const addSubNode = () => {
    const newSubNode: SubNode = {
      id: Date.now().toString(),
      name: "",
      scriptName: "",
      isDeployed: false,
      parameters: []
    };
    setSubNodes([...subNodes, newSubNode]);
  };

  const removeSubNode = (subNodeId: string) => {
    setSubNodes(subNodes.filter(s => s.id !== subNodeId));
  };

  const updateSubNode = (subNodeId: string, field: keyof Omit<SubNode, 'parameters'>, value: string | boolean) => {
    setSubNodes(subNodes.map(s => 
      s.id === subNodeId ? { ...s, [field]: value } : s
    ));
  };

  const addSubNodeParameter = (subNodeId: string) => {
    const newParam: SubNodeParameter = {
      id: Date.now().toString(),
      nodeParameterId: "",
      value: ""
    };
    setSubNodes(subNodes.map(s => 
      s.id === subNodeId 
        ? { ...s, parameters: [...s.parameters, newParam] }
        : s
    ));
  };

  const removeSubNodeParameter = (subNodeId: string, paramId: string) => {
    setSubNodes(subNodes.map(s => 
      s.id === subNodeId 
        ? { ...s, parameters: s.parameters.filter(p => p.id !== paramId) }
        : s
    ));
  };

  const updateSubNodeParameter = (subNodeId: string, paramId: string, field: keyof SubNodeParameter, value: string) => {
    setSubNodes(subNodes.map(s => 
      s.id === subNodeId 
        ? { 
            ...s, 
            parameters: s.parameters.map(p => 
              p.id === paramId ? { ...p, [field]: value } : p
            ) 
          }
        : s
    ));
  };

  const handleSave = async () => {
    if (!nodeName.trim()) {
      toast({
        title: "Error",
        description: "Node name is required",
        variant: "destructive"
      });
      return;
    }

    // Validate parameters
    for (const param of nodeParameters) {
      if (!param.key.trim()) {
        toast({
          title: "Error",
          description: "All parameter keys must be filled",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      if (version && versionData) {
        // Update existing version
        await nodeService.updateNode(id!, {
          name: nodeName,
          description: description,
          script: scriptName
        });
        
        toast({
          title: "Success",
          description: `Version ${version} updated successfully`
        });
      } else {
        // Update node
        await nodeService.updateNode(id!, {
          name: nodeName,
          description: description,
          script: scriptName
        });
        
        toast({
          title: "Success", 
          description: "Node updated successfully"
        });
      }
      
      navigate(`/nodes/${id}`);
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    navigate(`/nodes/${id}`);
  };

  const handleScriptUpload = async () => {
    if (!scriptFile || !id || !versionData) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      await nodeService.updateScript(id, versionData.version, scriptFile);
      toast({
        title: "Success",
        description: "Script updated successfully"
      });
      setScriptFile(null);
      // Clear the file input
      const fileInput = document.getElementById('scriptUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error updating script:', error);
      toast({
        title: "Error",
        description: "Failed to update script",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading node data...</p>
        </div>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="text-center py-8">
        <p>Node not found</p>
        <Button onClick={() => navigate('/nodes')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Nodes
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Node
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {version ? `Edit Version ${version}` : 'Edit Node'}
            </h1>
            <p className="text-muted-foreground">
              {version && versionData ? versionData.version_comment || 'No description' : node.description}
            </p>
          </div>
        </div>
      </div>

      {/* Node Information */}
      <Card>
        <CardHeader>
          <CardTitle>Node Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nodeName">Node Name *</Label>
            <Input
              id="nodeName"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Enter node name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter node description"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="scriptName">Script Name</Label>
              <Input
                id="scriptName"
                value={scriptName}
                onChange={(e) => setScriptName(e.target.value)}
                placeholder="Reference to saved script"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (scriptName) {
                    // Download existing script
                    const scriptContent = "# Current script content\nprint('Hello, World!')";
                    const blob = new Blob([scriptContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = scriptName || 'script.py';
                    a.click();
                    URL.revokeObjectURL(url);
                  } else {
                    toast({
                      title: "No Script",
                      description: "No script file available to download",
                      variant: "destructive"
                    });
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Current Script
              </Button>
              
              <input
                type="file"
                accept=".py,.js,.sh,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setScriptFile(file);
                  }
                }}
                style={{ display: 'none' }}
                id="scriptUpload"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('scriptUpload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select New Script
              </Button>
              
              {scriptFile && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Selected: {scriptFile.name}
                  </span>
                  <Button size="sm" onClick={handleScriptUpload}>
                    Upload Script
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Node Parameters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Node Parameters</CardTitle>
            <Button onClick={addParameter} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Parameter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {nodeParameters.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No parameters added yet</p>
          ) : (
            <div className="space-y-4">
              {nodeParameters.map((param) => (
                <div key={param.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label>Key *</Label>
                    <Input
                      value={param.key}
                      onChange={(e) => updateParameter(param.id, 'key', e.target.value)}
                      placeholder="Parameter key"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Value Type *</Label>
                    <Select
                      value={param.datatype}
                      onValueChange={(value) => updateParameter(param.id, 'datatype', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Integer">Integer</SelectItem>
                        <SelectItem value="Boolean">Boolean</SelectItem>
                        <SelectItem value="Float">Float</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeParameter(param.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SubNodes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>SubNodes</CardTitle>
            <Button onClick={addSubNode} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New Subnode
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {subNodes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No subnodes added yet</p>
          ) : (
            <div className="space-y-4">
              {subNodes.map((subnode) => (
                <div key={subnode.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{subnode.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {subnode.isDeployed ? "🟢 Deployed" : "🔴 Not Deployed"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSubNode(subnode.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}