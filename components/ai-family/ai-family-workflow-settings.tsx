"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, FileTextIcon, CodeIcon, MessageSquareIcon } from "lucide-react"

interface AIFamilyWorkflowSettingsProps {
  memberId: string
}

interface Workflow {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: React.ReactNode
  steps: WorkflowStep[]
}

interface WorkflowStep {
  id: string
  name: string
  description: string
  enabled: boolean
}

export function AIFamilyWorkflowSettings({ memberId }: AIFamilyWorkflowSettingsProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "image-generation",
      name: "Image Generation",
      description: "Generate and analyze images based on prompts",
      enabled: true,
      icon: <ImageIcon className="h-5 w-5" />,
      steps: [
        {
          id: "prompt-enhancement",
          name: "Prompt Enhancement",
          description: "Automatically enhance user prompts for better image generation",
          enabled: true,
        },
        {
          id: "image-generation",
          name: "Image Generation",
          description: "Generate images based on the enhanced prompt",
          enabled: true,
        },
        {
          id: "image-analysis",
          name: "Image Analysis",
          description: "Analyze generated images and provide summaries",
          enabled: true,
        },
        {
          id: "feedback-collection",
          name: "Feedback Collection",
          description: "Collect user feedback on generated images",
          enabled: false,
        },
      ],
    },
    {
      id: "document-processing",
      name: "Document Processing",
      description: "Process and analyze documents",
      enabled: false,
      icon: <FileTextIcon className="h-5 w-5" />,
      steps: [
        {
          id: "document-parsing",
          name: "Document Parsing",
          description: "Parse documents and extract text",
          enabled: true,
        },
        {
          id: "content-analysis",
          name: "Content Analysis",
          description: "Analyze document content and extract insights",
          enabled: true,
        },
        {
          id: "summary-generation",
          name: "Summary Generation",
          description: "Generate summaries of document content",
          enabled: true,
        },
      ],
    },
    {
      id: "code-assistant",
      name: "Code Assistant",
      description: "Assist with code generation and review",
      enabled: true,
      icon: <CodeIcon className="h-5 w-5" />,
      steps: [
        {
          id: "code-generation",
          name: "Code Generation",
          description: "Generate code based on user requirements",
          enabled: true,
        },
        {
          id: "code-review",
          name: "Code Review",
          description: "Review and provide feedback on user code",
          enabled: true,
        },
        {
          id: "documentation",
          name: "Documentation",
          description: "Generate documentation for code",
          enabled: false,
        },
      ],
    },
    {
      id: "chat-assistant",
      name: "Chat Assistant",
      description: "Provide conversational assistance",
      enabled: true,
      icon: <MessageSquareIcon className="h-5 w-5" />,
      steps: [
        {
          id: "intent-recognition",
          name: "Intent Recognition",
          description: "Recognize user intent from messages",
          enabled: true,
        },
        {
          id: "response-generation",
          name: "Response Generation",
          description: "Generate appropriate responses",
          enabled: true,
        },
        {
          id: "follow-up",
          name: "Follow-up",
          description: "Generate follow-up questions and suggestions",
          enabled: true,
        },
      ],
    },
  ])

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(
      workflows.map((workflow) =>
        workflow.id === workflowId ? { ...workflow, enabled: !workflow.enabled } : workflow,
      ),
    )
  }

  const toggleWorkflowStep = (workflowId: string, stepId: string) => {
    setWorkflows(
      workflows.map((workflow) =>
        workflow.id === workflowId
          ? {
              ...workflow,
              steps: workflow.steps.map((step) => (step.id === stepId ? { ...step, enabled: !step.enabled } : step)),
            }
          : workflow,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Available Workflows</h3>
        <div className="grid grid-cols-2 gap-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className={workflow.enabled ? "" : "opacity-70"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {workflow.icon}
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                  </div>
                  <Switch checked={workflow.enabled} onCheckedChange={() => toggleWorkflow(workflow.id)} />
                </div>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant={workflow.enabled ? "default" : "outline"}>
                    {workflow.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <span className="text-muted-foreground">{workflow.steps.length} steps</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Workflow Configuration</h3>

        <Tabs defaultValue={workflows[0]?.id}>
          <TabsList className="mb-4">
            {workflows.map((workflow) => (
              <TabsTrigger key={workflow.id} value={workflow.id} disabled={!workflow.enabled}>
                {workflow.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {workflows.map((workflow) => (
            <TabsContent key={workflow.id} value={workflow.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    {workflow.icon}
                    {workflow.name} Workflow
                  </CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                      {workflow.steps.map((step, index) => (
                        <div key={step.id}>
                          <div className="flex items-start gap-4 py-3">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                                {index + 1}
                              </div>
                              {index < workflow.steps.length - 1 && <div className="w-0.5 h-8 bg-border" />}
                            </div>

                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{step.name}</h4>
                                  <p className="text-sm text-muted-foreground">{step.description}</p>
                                </div>
                                <Switch
                                  checked={step.enabled}
                                  onCheckedChange={() => toggleWorkflowStep(workflow.id, step.id)}
                                  disabled={!workflow.enabled}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Add Step
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

