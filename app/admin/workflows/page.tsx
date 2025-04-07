"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Home, Plus, Workflow, ArrowRight, Bot, Trash2, Edit, Play, Pause, Save, Clock } from "lucide-react"
import { aiFamilyMembers } from "@/constants/ai-family"

export default function WorkflowsPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState([
    {
      id: "wf-1",
      name: "Content Creation Pipeline",
      description: "Automated workflow for creating blog content",
      status: "active",
      steps: [
        {
          id: "step-1",
          name: "Topic Research",
          aiFamily: "researcher",
          description: "Research trending topics and keywords",
          isActive: true,
        },
        {
          id: "step-2",
          name: "Content Outline",
          aiFamily: "writer",
          description: "Create detailed content outline",
          isActive: true,
        },
        {
          id: "step-3",
          name: "Draft Creation",
          aiFamily: "writer",
          description: "Write the first draft of the content",
          isActive: true,
        },
        {
          id: "step-4",
          name: "Content Review",
          aiFamily: "editor",
          description: "Review and improve the content",
          isActive: true,
        },
      ],
    },
    {
      id: "wf-2",
      name: "Image Generation Workflow",
      description: "Automated workflow for creating and optimizing images",
      status: "inactive",
      steps: [
        {
          id: "step-1",
          name: "Concept Creation",
          aiFamily: "creative",
          description: "Create image concepts based on requirements",
          isActive: true,
        },
        {
          id: "step-2",
          name: "Image Generation",
          aiFamily: "artist",
          description: "Generate images based on concepts",
          isActive: true,
        },
        {
          id: "step-3",
          name: "Image Optimization",
          aiFamily: "technical",
          description: "Optimize images for web use",
          isActive: true,
        },
      ],
    },
  ])

  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    steps: [],
  })

  const [newStep, setNewStep] = useState({
    name: "",
    aiFamily: "",
    description: "",
  })

  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0])
  const [isAddingWorkflow, setIsAddingWorkflow] = useState(false)
  const [isAddingStep, setIsAddingStep] = useState(false)
  const [isEditingWorkflow, setIsEditingWorkflow] = useState(false)

  const handleAddWorkflow = () => {
    if (!newWorkflow.name) return

    const workflow = {
      id: `wf-${workflows.length + 1}`,
      name: newWorkflow.name,
      description: newWorkflow.description,
      status: "inactive",
      steps: [],
    }

    setWorkflows([...workflows, workflow])
    setNewWorkflow({ name: "", description: "", steps: [] })
    setIsAddingWorkflow(false)
  }

  const handleAddStep = () => {
    if (!newStep.name || !newStep.aiFamily) return

    const step = {
      id: `step-${selectedWorkflow.steps.length + 1}`,
      name: newStep.name,
      aiFamily: newStep.aiFamily,
      description: newStep.description,
      isActive: true,
    }

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, step],
    }

    setWorkflows(workflows.map((wf) => (wf.id === selectedWorkflow.id ? updatedWorkflow : wf)))
    setSelectedWorkflow(updatedWorkflow)
    setNewStep({ name: "", aiFamily: "", description: "" })
    setIsAddingStep(false)
  }

  const handleUpdateWorkflow = () => {
    setWorkflows(workflows.map((wf) => (wf.id === selectedWorkflow.id ? selectedWorkflow : wf)))
    setIsEditingWorkflow(false)
  }

  const handleToggleWorkflowStatus = (workflow) => {
    const updatedWorkflow = {
      ...workflow,
      status: workflow.status === "active" ? "inactive" : "active",
    }

    setWorkflows(workflows.map((wf) => (wf.id === workflow.id ? updatedWorkflow : wf)))
    if (selectedWorkflow.id === workflow.id) {
      setSelectedWorkflow(updatedWorkflow)
    }
  }

  const handleDeleteWorkflow = (id) => {
    setWorkflows(workflows.filter((wf) => wf.id !== id))
    if (selectedWorkflow.id === id && workflows.length > 1) {
      setSelectedWorkflow(workflows.find((wf) => wf.id !== id))
    }
  }

  const handleToggleStepStatus = (stepId) => {
    const updatedSteps = selectedWorkflow.steps.map((step) =>
      step.id === stepId ? { ...step, isActive: !step.isActive } : step,
    )

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: updatedSteps,
    }

    setWorkflows(workflows.map((wf) => (wf.id === selectedWorkflow.id ? updatedWorkflow : wf)))
    setSelectedWorkflow(updatedWorkflow)
  }

  const handleDeleteStep = (stepId) => {
    const updatedSteps = selectedWorkflow.steps.filter((step) => step.id !== stepId)

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: updatedSteps,
    }

    setWorkflows(workflows.map((wf) => (wf.id === selectedWorkflow.id ? updatedWorkflow : wf)))
    setSelectedWorkflow(updatedWorkflow)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workflow Management</h1>
          <p className="text-muted-foreground">Create and manage AI workflows and automation</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
          </Button>
          <Dialog open={isAddingWorkflow} onOpenChange={setIsAddingWorkflow}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>Add a new workflow to automate AI processes</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input
                    id="name"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    placeholder="Content Creation Pipeline"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    placeholder="Describe the purpose of this workflow"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingWorkflow(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWorkflow}>Create Workflow</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Workflows</CardTitle>
              <CardDescription>Select a workflow to view or edit</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {workflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedWorkflow?.id === workflow.id ? "bg-secondary border-primary" : "hover:bg-secondary/50"
                      }`}
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{workflow.name}</div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            workflow.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {workflow.status === "active" ? "Active" : "Inactive"}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{workflow.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Workflow className="h-3 w-3 mr-1" />
                        {workflow.steps.length} steps
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedWorkflow ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedWorkflow.name}</CardTitle>
                    <CardDescription>{selectedWorkflow.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setIsEditingWorkflow(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedWorkflow.status === "active" ? "destructive" : "default"}
                      size="icon"
                      onClick={() => handleToggleWorkflowStatus(selectedWorkflow)}
                    >
                      {selectedWorkflow.status === "active" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteWorkflow(selectedWorkflow.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="steps">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="steps">Workflow Steps</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="history">Execution History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="steps" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Steps</h3>
                      <Dialog open={isAddingStep} onOpenChange={setIsAddingStep}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Step
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Workflow Step</DialogTitle>
                            <DialogDescription>Add a new step to the workflow</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="step-name">Step Name</Label>
                              <Input
                                id="step-name"
                                value={newStep.name}
                                onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                                placeholder="Content Research"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ai-family">AI Family Member</Label>
                              <Select
                                value={newStep.aiFamily}
                                onValueChange={(value) => setNewStep({ ...newStep, aiFamily: value })}
                              >
                                <SelectTrigger id="ai-family">
                                  <SelectValue placeholder="Select AI Family Member" />
                                </SelectTrigger>
                                <SelectContent>
                                  {aiFamilyMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                      {member.name} - {member.specialty}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="step-description">Description</Label>
                              <Textarea
                                id="step-description"
                                value={newStep.description}
                                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                                placeholder="Describe what this step does"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddingStep(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddStep}>Add Step</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-4">
                      {selectedWorkflow.steps.length === 0 ? (
                        <div className="text-center py-8 border rounded-md">
                          <Workflow className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No steps added yet. Add a step to get started.</p>
                        </div>
                      ) : (
                        selectedWorkflow.steps.map((step, index) => (
                          <div key={step.id} className="border rounded-md">
                            <div className="p-4 flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-medium">{step.name}</h4>
                                  <p className="text-sm text-muted-foreground">{step.description}</p>
                                  <div className="flex items-center mt-2">
                                    <Bot className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span className="text-xs">
                                      {aiFamilyMembers.find((m) => m.id === step.aiFamily)?.name || step.aiFamily}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={step.isActive}
                                  onCheckedChange={() => handleToggleStepStatus(step.id)}
                                />
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteStep(step.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {index < selectedWorkflow.steps.length - 1 && (
                              <div className="flex justify-center py-2">
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="workflow-name">Workflow Name</Label>
                        <Input
                          id="workflow-name"
                          value={selectedWorkflow.name}
                          onChange={(e) => setSelectedWorkflow({ ...selectedWorkflow, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workflow-description">Description</Label>
                        <Textarea
                          id="workflow-description"
                          value={selectedWorkflow.description}
                          onChange={(e) => setSelectedWorkflow({ ...selectedWorkflow, description: e.target.value })}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-execute">Auto Execute</Label>
                          <Switch id="auto-execute" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Automatically execute this workflow on a schedule
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notifications">Notifications</Label>
                          <Switch id="notifications" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications when workflow execution completes
                        </p>
                      </div>

                      <Button onClick={handleUpdateWorkflow} className="w-full">
                        <Save className="h-4 w-4 mr-1" />
                        Save Changes
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="pt-4">
                    <div className="text-center py-8 border rounded-md">
                      <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No execution history available.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Workflow className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Workflow Selected</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Select a workflow from the list or create a new one to get started.
                </p>
                <Button onClick={() => setIsAddingWorkflow(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create New Workflow
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

