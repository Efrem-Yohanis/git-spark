import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nodeService } from "@/services/nodeService";
import { parameterService, Parameter } from "@/services/parameterService";

interface VersionParameter {
  id: string;
  key: string;
  datatype: string;
  description?: string;
}

export function EditVersionPage() {
  const { id, version } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [versionData, setVersionData] = useState<any>(null);
  const [versionParameters, setVersionParameters] = useState<VersionParameter[]>([]);
  const [allParameters, setAllParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [scriptFile, setScriptFile] = useState<File | null>(null);

  useEffect(() => {
    if (id && version) {
      loadVersionData();
      loadAllParameters();
    }
  }, [id, version]);

  const loadVersionData = async () => {
    try {
      const versionResponse = await nodeService.getNodeVersion(id!, parseInt(version!));
      const versionData = Array.isArray(versionResponse) ? versionResponse[0] : versionResponse;
      const versionDetails = versionData.versions?.[0] || versionData;
      
      setVersionData(versionDetails);
      setVersionParameters(versionDetails.parameters || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading version data:', error);
      toast({
        title: "Error",
        description: "Failed to load version data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const loadAllParameters = async () => {
    try {
      const parameters = await parameterService.getParameters();
      setAllParameters(parameters);
    } catch (error) {
      console.error('Error loading parameters:', error);
    }
  };

  const addParameters = async (parameterIds: string[]) => {
    try {
      await nodeService.addParametersToVersion(id!, parseInt(version!), parameterIds);
      toast({
        title: "Success",
        description: "Parameters added successfully"
      });
      loadVersionData(); // Reload to get updated parameters
    } catch (error) {
      console.error('Error adding parameters:', error);
      toast({
        title: "Error",
        description: "Failed to add parameters",
        variant: "destructive"
      });
    }
  };

  const removeParameters = async (parameterIds: string[]) => {
    try {
      await nodeService.removeParametersFromVersion(id!, parseInt(version!), parameterIds);
      toast({
        title: "Success",
        description: "Parameters removed successfully"
      });
      loadVersionData(); // Reload to get updated parameters
    } catch (error) {
      console.error('Error removing parameters:', error);
      toast({
        title: "Error",
        description: "Failed to remove parameters",
        variant: "destructive"
      });
    }
  };

  const handleAddParameter = (parameterId: string) => {
    if (parameterId) {
      addParameters([parameterId]);
    }
  };

  const handleRemoveParameter = (parameterId: string) => {
    removeParameters([parameterId]);
  };

  const handleScriptUpload = async () => {
    if (!scriptFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      await nodeService.updateScript(id!, parseInt(version!), scriptFile);
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

  const handleGoBack = () => {
    navigate(`/nodes/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading version data...</p>
        </div>
      </div>
    );
  }

  if (!versionData) {
    return (
      <div className="text-center py-8">
        <p>Version data not found</p>
        <Button onClick={handleGoBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const availableParameters = allParameters.filter(
    param => !versionParameters.some(vp => vp.id === param.id)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Node
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Version {version}</h1>
            <p className="text-muted-foreground">{versionData.version_comment || 'No description'}</p>
          </div>
        </div>
      </div>

      {/* Script Update */}
      <Card>
        <CardHeader>
          <CardTitle>Script File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
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
              onClick={() => document.getElementById('scriptUpload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Script File
            </Button>
            {scriptFile && (
              <>
                <span className="text-sm text-muted-foreground">
                  Selected: {scriptFile.name}
                </span>
                <Button onClick={handleScriptUpload}>
                  Upload Script
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Version Parameters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Version Parameters</CardTitle>
            <div className="flex items-center space-x-2">
              <Select onValueChange={handleAddParameter}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Add parameter..." />
                </SelectTrigger>
                <SelectContent>
                  {availableParameters.map((param) => (
                    <SelectItem key={param.id} value={param.id}>
                      {param.key} ({param.datatype})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {versionParameters.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No parameters assigned to this version</p>
          ) : (
            <div className="space-y-4">
              {versionParameters.map((param) => (
                <div key={param.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <Label className="font-medium">{param.key}</Label>
                        <p className="text-sm text-muted-foreground">
                          Type: {param.datatype}
                        </p>
                        {param.description && (
                          <p className="text-sm text-muted-foreground">
                            {param.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveParameter(param.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note about subnodes */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            <strong>Note:</strong> Subnode editing is not available on this page. 
            Subnodes are managed from the main node detail page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}