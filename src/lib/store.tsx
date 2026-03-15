// Client-side state management using React context + localStorage
"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { DayData, CausalEdge, Variable, VARIABLES, DEFAULT_EDGES, DEFAULT_INSIGHTS, generateDemoData } from "./demo-data";

export interface Insight {
  id: string;
  content: string;
  type: string;
  impact: "high" | "medium" | "low";
  nodes: string[];
  createdAt?: string;
}

export interface WhatIfResult {
  variable: string;
  change: number; // percentage
  reasoning?: string;
}

interface AppState {
  user: { id: string; email: string; name: string } | null;
  data: DayData[];
  variables: Variable[];
  edges: CausalEdge[];
  insights: Insight[];
  apiKey: string;
  initialized: boolean;
}

type Action =
  | { type: "SET_USER"; user: AppState["user"] }
  | { type: "SET_DATA"; data: DayData[] }
  | { type: "ADD_DATA_POINT"; point: DayData }
  | { type: "SET_EDGES"; edges: CausalEdge[] }
  | { type: "TOGGLE_EDGE_CONFIRM"; edgeId: string }
  | { type: "REMOVE_EDGE"; edgeId: string }
  | { type: "ADD_EDGES"; edges: CausalEdge[] }
  | { type: "SET_INSIGHTS"; insights: Insight[] }
  | { type: "SET_API_KEY"; key: string }
  | { type: "INIT"; state: Partial<AppState> }
  | { type: "LOGOUT" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_USER": return { ...state, user: action.user };
    case "SET_DATA": return { ...state, data: action.data };
    case "ADD_DATA_POINT": return { ...state, data: [...state.data, action.point] };
    case "SET_EDGES": return { ...state, edges: action.edges };
    case "TOGGLE_EDGE_CONFIRM": return {
      ...state,
      edges: state.edges.map(e => e.id === action.edgeId ? { ...e, confirmed: !e.confirmed } : e),
    };
    case "REMOVE_EDGE": return { ...state, edges: state.edges.filter(e => e.id !== action.edgeId) };
    case "ADD_EDGES": return { ...state, edges: [...state.edges, ...action.edges] };
    case "SET_INSIGHTS": return { ...state, insights: action.insights };
    case "SET_API_KEY": return { ...state, apiKey: action.key };
    case "INIT": return { ...state, ...action.state, initialized: true };
    case "LOGOUT": return { ...initialState, initialized: true };
    default: return state;
  }
}

const initialState: AppState = {
  user: null,
  data: [],
  variables: VARIABLES,
  edges: [],
  insights: [],
  apiKey: "",
  initialized: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("causalme_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: "INIT", state: parsed });
      } else {
        // First visit: load demo data
        const demoData = generateDemoData(30);
        dispatch({
          type: "INIT",
          state: {
            user: { id: "demo", email: "demo@causalme.app", name: "Demo User" },
            data: demoData,
            edges: DEFAULT_EDGES,
            insights: DEFAULT_INSIGHTS,
            apiKey: "",
          },
        });
      }
    } catch {
      const demoData = generateDemoData(30);
      dispatch({
        type: "INIT",
        state: {
          user: { id: "demo", email: "demo@causalme.app", name: "Demo User" },
          data: demoData,
          edges: DEFAULT_EDGES,
          insights: DEFAULT_INSIGHTS,
        },
      });
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!state.initialized) return;
    try {
      const { initialized, variables, ...toSave } = state;
      localStorage.setItem("causalme_state", JSON.stringify(toSave));
    } catch {}
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
