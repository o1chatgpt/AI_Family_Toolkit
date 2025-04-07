"use client"

import React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode, useRef, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import type { AIFamilyMember } from "@/types/ai-family"

// Define the system state
type SystemState = {
  entities: Record<string, AIFamilyMember>
  apiConnections: Record<string, any> // Replace 'any' with the actual type
  contextVariables: Record<string, any> // Replace 'any' with the actual type
  events: SystemEvent[]
  isInitialized: boolean
}

// Define the system context
type SystemContextType = {
  state: SystemState
  registerEntity: (entity: Omit<AIFamilyMember, "id">) => string
  updateEntity: (id: string, updates: Partial<AIFamilyMember>) => void
  removeEntity: (id: string) => void
  getEntity: (id: string) => AIFamilyMember | undefined
  findEntities: (criteria: Partial<AIFamilyMember>) => AIFamilyMember[]
  // Add other methods as needed
}

// Define the system event type
export type SystemEvent = {
  id: string
  type: string
  source: string
  timestamp: Date
  data: any
  metadata?: Record<string, any>
}

// Create the system context
const AIFamilyContext = createContext<SystemContextType | undefined>(undefined)

// Initial state
const initialState: SystemState = {
  entities: {},
  apiConnections: {},
  contextVariables: {},
  events: [],
  isInitialized: false,
}

// Create the system provider
export function AIFamilyProvider({ children }: { children: ReactNode }) {
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
  const registerEntity = useCallback((entity: Omit<AIFamilyMember, "id">): string => {
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

  const updateEntity = useCallback((id: string, updates: Partial<AIFamilyMember>) => {
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
    (id: string): AIFamilyMember | undefined => {
      return state.entities[id]
    },
    [state.entities],
  )

  const findEntities = useCallback(
    (criteria: Partial<AIFamilyMember>): AIFamilyMember[] => {
      return Object.values(state.entities).filter((entity) => {
        return Object.entries(criteria).every(([key, value]) => {
          return entity[key as keyof AIFamilyMember] === value
        })
      })
    },
    [state.entities],
  )

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
  const contextValue = React.useMemo(
    () => ({
      state,
      registerEntity,
      updateEntity,
      removeEntity,
      getEntity,
      findEntities,
      emitEvent,
      addEventListener,
    }),
    [state, registerEntity, updateEntity, removeEntity, getEntity, findEntities, emitEvent, addEventListener],
  )

  // Use memoized context value to prevent unnecessary re-renders
  const memoizedContextValue = React.useMemo(() => contextValue, [contextValue])

  return <AIFamilyContext.Provider value={memoizedContextValue}>{children}</AIFamilyContext.Provider>
}

// Create a hook to use the system context
export const useAIFamily = () => {
  const context = useContext(AIFamilyContext)
  if (context === undefined) {
    throw new Error("useAIFamily must be used within an AIFamilyProvider")
  }
  return context
}

