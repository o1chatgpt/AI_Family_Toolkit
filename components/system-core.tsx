"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { v4 as uuidv4 } from "uuid"

// Define types for our system
export type EntityReference = {
  id: string
  type: "user" | "project" | "prompt" | "content" | "api"
  name: string
  value: any
  metadata?: Record<string, any>
  relationships?: EntityRelationship[]
}

export type EntityRelationship = {
  targetId: string
  type: "parent" | "child" | "reference" | "dependency"
  metadata?: Record<string, any>
}

export type APIConnection = {
  id: string
  name: string
  endpoint: string
  authType: "none" | "apiKey" | "oauth" | "bearer"
  authData?: Record<string, any>
  status: "disconnected" | "connecting" | "connected" | "error"
  lastUsed?: Date
  metadata?: Record<string, any>
}

export type ContextVariable = {
  key: string
  value: any
  scope: "global" | "user" | "project" | "session"
  type: "string" | "number" | "boolean" | "object" | "array"
  metadata?: Record<string, any>
}

export type SystemEvent = {
  id: string
  type: string
  source: string
  timestamp: Date
  data: any
  metadata?: Record<string, any>
}

// Define the system state
type SystemState = {
  entities: Record<string, EntityReference>
  apiConnections: Record<string, APIConnection>
  contextVariables: Record<string, ContextVariable>
  events: SystemEvent[]
  isInitialized: boolean
}

// Define the system context
type SystemContextType = {
  state: SystemState
  registerEntity: (entity: Omit<EntityReference, "id">) => string
  updateEntity: (id: string, updates: Partial<EntityReference>) => void
  removeEntity: (id: string) => void
  getEntity: (id: string) => EntityReference | undefined
  findEntities: (criteria: Partial<EntityReference>) => EntityReference[]

  registerAPI: (api: Omit<APIConnection, "id">) => string
  updateAPI: (id: string, updates: Partial<APIConnection>) => void
  removeAPI: (id: string) => void
  connectAPI: (id: string) => Promise<boolean>

  setContextVariable: (variable: Omit<ContextVariable, "id">) => void
  getContextVariable: (key: string) => any
  removeContextVariable: (key: string) => void

  emitEvent: (event: Omit<SystemEvent, "id" | "timestamp">) => void
  addEventListener: (type: string, callback: (event: SystemEvent) => void) => () => void
}

// Create the system context
const SystemContext = createContext<SystemContextType | undefined>(undefined)

// Initial state
const initialState: SystemState = {
  entities: {},
  apiConnections: {},
  contextVariables: {},
  events: [],
  isInitialized: false,
}

// Create the system provider
export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SystemState>(initialState)
  const isInitialLoadRef = useRef(true)
  const isStateChangedRef = useRef(false)

  // Initialize the system
  useEffect(() => {
    const loadState = async () => {
      try {
        // Load state from localStorage or other storage
        const savedState = localStorage.getItem("system_state")
        if (savedState) {
          const parsedState = JSON.parse(savedState)
          setState((prevState) => ({
            ...prevState,
            ...parsedState,
            isInitialized: true,
          }))
        } else {
          setState((prevState) => ({
            ...prevState,
            isInitialized: true,
          }))
        }
      } catch (error) {
        console.error("Failed to initialize system:", error)
        setState((prevState) => ({
          ...prevState,
          isInitialized: true,
        }))
      }
    }

    if (isInitialLoadRef.current) {
      loadState()
      isInitialLoadRef.current = false
    }
  }, [])

  // Save state when it changes
  useEffect(() => {
    if (state.isInitialized && !isInitialLoadRef.current) {
      try {
        // Prepare state for storage (remove circular references, etc.)
        const stateToSave = {
          entities: state.entities,
          apiConnections: state.apiConnections,
          contextVariables: state.contextVariables,
          // We don't save events as they're transient
        }

        // Only save if state has actually changed
        if (isStateChangedRef.current) {
          localStorage.setItem("system_state", JSON.stringify(stateToSave))
          isStateChangedRef.current = false
        }
      } catch (error) {
        console.error("Failed to save system state:", error)
      }
    }
  }, [state])

  // Event listeners
  const [eventListeners, setEventListeners] = useState<Record<string, ((event: SystemEvent) => void)[]>>({})

  // Entity management
  const registerEntity = useCallback((entity: Omit<EntityReference, "id">): string => {
    const id = uuidv4()
    setState((prevState) => {
      isStateChangedRef.current = true
      return {
        ...prevState,
        entities: {
          ...prevState.entities,
          [id]: {
            ...entity,
            id,
          },
        },
      }
    })

    // Emit entity created event
    emitEvent({
      type: "entity.created",
      source: "system",
      data: { id, entity },
    })

    return id
  }, [])

  const updateEntity = useCallback((id: string, updates: Partial<EntityReference>) => {
    setState((prevState) => {
      if (!prevState.entities[id]) return prevState

      isStateChangedRef.current = true
      return {
        ...prevState,
        entities: {
          ...prevState.entities,
          [id]: {
            ...prevState.entities[id],
            ...updates,
          },
        },
      }
    })

    // Emit entity updated event
    emitEvent({
      type: "entity.updated",
      source: "system",
      data: { id, updates },
    })
  }, [])

  const removeEntity = useCallback((id: string) => {
    setState((prevState) => {
      const { [id]: removed, ...rest } = prevState.entities
      isStateChangedRef.current = true
      return {
        ...prevState,
        entities: rest,
      }
    })

    // Emit entity removed event
    emitEvent({
      type: "entity.removed",
      source: "system",
      data: { id },
    })
  }, [])

  const getEntity = useCallback(
    (id: string): EntityReference | undefined => {
      return state.entities[id]
    },
    [state.entities],
  )

  const findEntities = useCallback(
    (criteria: Partial<EntityReference>): EntityReference[] => {
      return Object.values(state.entities).filter((entity) => {
        return Object.entries(criteria).every(([key, value]) => {
          return entity[key as keyof EntityReference] === value
        })
      })
    },
    [state.entities],
  )

  // API management
  const registerAPI = useCallback((api: Omit<APIConnection, "id">): string => {
    const id = uuidv4()
    setState((prevState) => {
      isStateChangedRef.current = true
      return {
        ...prevState,
        apiConnections: {
          ...prevState.apiConnections,
          [id]: {
            ...api,
            id,
          },
        },
      }
    })

    // Emit API registered event
    emitEvent({
      type: "api.registered",
      source: "system",
      data: { id, api },
    })

    return id
  }, [])

  const updateAPI = useCallback((id: string, updates: Partial<APIConnection>) => {
    setState((prevState) => {
      if (!prevState.apiConnections[id]) return prevState

      isStateChangedRef.current = true
      return {
        ...prevState,
        apiConnections: {
          ...prevState.apiConnections,
          [id]: {
            ...prevState.apiConnections[id],
            ...updates,
          },
        },
      }
    })

    // Emit API updated event
    emitEvent({
      type: "api.updated",
      source: "system",
      data: { id, updates },
    })
  }, [])

  const removeAPI = useCallback((id: string) => {
    setState((prevState) => {
      const { [id]: removed, ...rest } = prevState.apiConnections
      isStateChangedRef.current = true
      return {
        ...prevState,
        apiConnections: rest,
      }
    })

    // Emit API removed event
    emitEvent({
      type: "api.removed",
      source: "system",
      data: { id },
    })
  }, [])

  const connectAPI = useCallback(
    async (id: string): Promise<boolean> => {
      const api = state.apiConnections[id]
      if (!api) return false

      // Update status to connecting
      updateAPI(id, { status: "connecting" })

      try {
        // Implement actual API connection logic here
        // This is a placeholder for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Update status to connected
        updateAPI(id, {
          status: "connected",
          lastUsed: new Date(),
        })

        // Emit API connected event
        emitEvent({
          type: "api.connected",
          source: "system",
          data: { id, api },
        })

        return true
      } catch (error) {
        // Update status to error
        updateAPI(id, { status: "error" })

        // Emit API error event
        emitEvent({
          type: "api.error",
          source: "system",
          data: { id, error },
        })

        return false
      }
    },
    [state.apiConnections, updateAPI],
  )

  // Context variable management
  const setContextVariable = useCallback((variable: Omit<ContextVariable, "id">) => {
    setState((prevState) => {
      isStateChangedRef.current = true
      return {
        ...prevState,
        contextVariables: {
          ...prevState.contextVariables,
          [variable.key]: variable,
        },
      }
    })

    // Emit context variable set event
    emitEvent({
      type: "context.set",
      source: "system",
      data: { variable },
    })
  }, [])

  const getContextVariable = useCallback(
    (key: string): any => {
      return state.contextVariables[key]?.value
    },
    [state.contextVariables],
  )

  const removeContextVariable = useCallback((key: string) => {
    setState((prevState) => {
      const { [key]: removed, ...rest } = prevState.contextVariables
      isStateChangedRef.current = true
      return {
        ...prevState,
        contextVariables: rest,
      }
    })

    // Emit context variable removed event
    emitEvent({
      type: "context.removed",
      source: "system",
      data: { key },
    })
  }, [])

  // Event management
  const emitEvent = useCallback(
    (event: Omit<SystemEvent, "id" | "timestamp">) => {
      const fullEvent: SystemEvent = {
        ...event,
        id: uuidv4(),
        timestamp: new Date(),
      }

      setState((prevState) => ({
        ...prevState,
        events: [...prevState.events, fullEvent],
      }))

      // Notify listeners
      if (eventListeners[event.type]) {
        eventListeners[event.type].forEach((listener) => {
          try {
            listener(fullEvent)
          } catch (error) {
            console.error(`Error in event listener for ${event.type}:`, error)
          }
        })
      }

      // Notify global listeners
      if (eventListeners["*"]) {
        eventListeners["*"].forEach((listener) => {
          try {
            listener(fullEvent)
          } catch (error) {
            console.error(`Error in global event listener:`, error)
          }
        })
      }
    },
    [eventListeners],
  )

  const addEventListener = useCallback((type: string, callback: (event: SystemEvent) => void) => {
    setEventListeners((prevListeners) => {
      const listeners = prevListeners[type] || []
      return {
        ...prevListeners,
        [type]: [...listeners, callback],
      }
    })

    // Return a function to remove the listener
    return () => {
      setEventListeners((prevListeners) => {
        const listeners = prevListeners[type] || []
        return {
          ...prevListeners,
          [type]: listeners.filter((listener) => listener !== callback),
        }
      })
    }
  }, [])

  // Create the context value with memoized functions to prevent unnecessary re-renders
  const contextValue = useCallback(
    () => ({
      state,
      registerEntity,
      updateEntity,
      removeEntity,
      getEntity,
      findEntities,
      registerAPI,
      updateAPI,
      removeAPI,
      connectAPI,
      setContextVariable,
      getContextVariable,
      removeContextVariable,
      emitEvent,
      addEventListener,
    }),
    [
      state,
      registerEntity,
      updateEntity,
      removeEntity,
      getEntity,
      findEntities,
      registerAPI,
      updateAPI,
      removeAPI,
      connectAPI,
      setContextVariable,
      getContextVariable,
      removeContextVariable,
      emitEvent,
      addEventListener,
    ],
  )

  // Use memoized context value to prevent unnecessary re-renders
  const memoizedContextValue = useCallback(contextValue, [contextValue])

  return <SystemContext.Provider value={memoizedContextValue()}>{children}</SystemContext.Provider>
}

// Create a hook to use the system context
export function useSystem() {
  const context = useContext(SystemContext)
  if (context === undefined) {
    throw new Error("useSystem must be used within a SystemProvider")
  }
  return context
}

