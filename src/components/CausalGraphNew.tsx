"use client";

import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { CausalEdge, Variable, VARIABLES } from "@/lib/demo-data";

interface SimNode {
  id: string;
  label: string;
  icon: string;
  color: string;
  domain: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  radius: number;
  pulsePhase: number;
  value?: number; // for what-if overlay
  changePercent?: number;
}

interface Props {
  edges: CausalEdge[];
  variables?: Variable[];
  onNodeClick?: (nodeId: string) => void;
  highlightNode?: string | null;
  whatIfChanges?: Record<string, number>; // nodeId -> percent change
  interactive?: boolean;
  className?: string;
}

const DPR = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;

export default function CausalGraph({
  edges,
  variables = VARIABLES,
  onNodeClick,
  highlightNode,
  whatIfChanges,
  interactive = true,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const hoveredRef = useRef<string | null>(null);
  const dragRef = useRef<{ nodeId: string; offsetX: number; offsetY: number } | null>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 900, height: 600 });

  // Responsive sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setSize({ width: Math.floor(width), height: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build node adjacency for layout
  const activeNodeIds = useMemo(() => {
    const ids = new Set<string>();
    edges.forEach(e => { ids.add(e.cause); ids.add(e.effect); });
    variables.forEach(v => ids.add(v.id));
    return ids;
  }, [edges, variables]);

  // Initialize nodes
  useEffect(() => {
    const { width, height } = size;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.30;
    const nodeRadius = Math.max(20, Math.min(32, width * 0.035));

    const activeVars = variables.filter(v => activeNodeIds.has(v.id));
    
    // Keep existing positions if we have them
    const existingMap = new Map(nodesRef.current.map(n => [n.id, n]));

    nodesRef.current = activeVars.map((v, i) => {
      const angle = (i / activeVars.length) * Math.PI * 2 - Math.PI / 2;
      const existing = existingMap.get(v.id);
      const tx = cx + Math.cos(angle) * r;
      const ty = cy + Math.sin(angle) * r;
      return {
        id: v.id,
        label: v.name,
        icon: v.icon,
        color: v.color,
        domain: v.domain,
        x: existing?.x ?? tx,
        y: existing?.y ?? ty,
        vx: 0,
        vy: 0,
        targetX: tx,
        targetY: ty,
        radius: nodeRadius,
        pulsePhase: existing?.pulsePhase ?? Math.random() * Math.PI * 2,
        changePercent: whatIfChanges?.[v.id] ?? 0,
      };
    });
  }, [size, variables, activeNodeIds, whatIfChanges]);

  // Apply what-if changes
  useEffect(() => {
    if (!whatIfChanges) return;
    nodesRef.current.forEach(n => {
      n.changePercent = whatIfChanges[n.id] ?? 0;
    });
  }, [whatIfChanges]);

  const getNode = useCallback((id: string) => nodesRef.current.find(n => n.id === id), []);

  // Force simulation step
  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    const { width, height } = size;

    // Spring to target positions
    for (const node of nodes) {
      const dx = node.targetX - node.x;
      const dy = node.targetY - node.y;
      node.vx += dx * 0.005;
      node.vy += dy * 0.005;
    }

    // Repulsion between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDist = (a.radius + b.radius) * 3;
        if (dist < minDist) {
          const force = (minDist - dist) / dist * 0.5;
          a.vx -= dx * force;
          a.vy -= dy * force;
          b.vx += dx * force;
          b.vy += dy * force;
        }
      }
    }

    // Edge attraction
    for (const edge of edges) {
      const src = getNode(edge.cause);
      const tgt = getNode(edge.effect);
      if (!src || !tgt) continue;
      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const idealDist = Math.min(width, height) * 0.25;
      const force = (dist - idealDist) / dist * 0.002 * Math.abs(edge.strength);
      src.vx += dx * force;
      src.vy += dy * force;
      tgt.vx -= dx * force;
      tgt.vy -= dy * force;
    }

    // Apply velocity with damping
    for (const node of nodes) {
      if (dragRef.current?.nodeId === node.id) continue;
      node.vx *= 0.85;
      node.vy *= 0.85;
      node.x += node.vx;
      node.y += node.vy;
      // Keep in bounds
      node.x = Math.max(node.radius + 10, Math.min(width - node.radius - 10, node.x));
      node.y = Math.max(node.radius + 10, Math.min(height - node.radius - 10, node.y));
    }
  }, [size, edges, getNode]);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = size;

    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(DPR, DPR);

    timeRef.current += 0.016;
    const t = timeRef.current;

    simulate();

    // Background
    ctx.fillStyle = "#0c0f1a";
    ctx.fillRect(0, 0, width, height);

    // Subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.02)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    const hl = highlightNode || hoveredRef.current;

    // Draw edges
    for (const edge of edges) {
      const src = getNode(edge.cause);
      const tgt = getNode(edge.effect);
      if (!src || !tgt) continue;

      const isHL = hl ? (edge.cause === hl || edge.effect === hl) : false;
      const alpha = isHL ? 0.7 : hl ? 0.06 : 0.18;
      const lw = isHL ? Math.max(1.5, Math.abs(edge.strength) * 4) : Math.max(0.5, Math.abs(edge.strength) * 2);

      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const mx = (src.x + tgt.x) / 2;
      const my = (src.y + tgt.y) / 2;
      const nx = -dy * 0.12;
      const ny = dx * 0.12;

      // Edge color: positive=teal, negative=coral
      const edgeRGB = edge.strength > 0 ? "99,230,190" : "248,113,113";
      
      const grad = ctx.createLinearGradient(src.x, src.y, tgt.x, tgt.y);
      grad.addColorStop(0, `rgba(${edgeRGB}, ${alpha * 0.6})`);
      grad.addColorStop(0.5, `rgba(${edgeRGB}, ${alpha})`);
      grad.addColorStop(1, `rgba(${edgeRGB}, ${alpha * 0.6})`);

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = lw;
      ctx.moveTo(src.x, src.y);
      ctx.quadraticCurveTo(mx + nx, my + ny, tgt.x, tgt.y);
      ctx.stroke();

      // Animated particle on highlighted edges
      if (isHL) {
        const speed = 0.3 + Math.abs(edge.strength) * 0.3;
        const pt = ((t * speed) % 1);
        const px = (1 - pt) * (1 - pt) * src.x + 2 * (1 - pt) * pt * (mx + nx) + pt * pt * tgt.x;
        const py = (1 - pt) * (1 - pt) * src.y + 2 * (1 - pt) * pt * (my + ny) + pt * pt * tgt.y;
        
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 8);
        glow.addColorStop(0, `rgba(${edgeRGB}, 0.9)`);
        glow.addColorStop(1, `rgba(${edgeRGB}, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${edgeRGB}, 1)`;
        ctx.fill();

        // Arrow at 80%
        const at = 0.8;
        const ax = (1 - at) * (1 - at) * src.x + 2 * (1 - at) * at * (mx + nx) + at * at * tgt.x;
        const ay = (1 - at) * (1 - at) * src.y + 2 * (1 - at) * at * (my + ny) + at * at * tgt.y;
        const at2 = 0.78;
        const ax2 = (1 - at2) * (1 - at2) * src.x + 2 * (1 - at2) * at2 * (mx + nx) + at2 * at2 * tgt.x;
        const ay2 = (1 - at2) * (1 - at2) * src.y + 2 * (1 - at2) * at2 * (my + ny) + at2 * at2 * tgt.y;
        const angle = Math.atan2(ay - ay2, ax - ax2);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - 10 * Math.cos(angle - 0.35), ay - 10 * Math.sin(angle - 0.35));
        ctx.lineTo(ax - 10 * Math.cos(angle + 0.35), ay - 10 * Math.sin(angle + 0.35));
        ctx.closePath();
        ctx.fillStyle = `rgba(${edgeRGB}, ${alpha})`;
        ctx.fill();
      }

      // Strength label on hover
      if (isHL) {
        const labelX = mx + nx * 0.5;
        const labelY = my + ny * 0.5;
        ctx.font = "600 10px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(${edgeRGB}, 0.9)`;
        const sign = edge.strength > 0 ? "+" : "";
        ctx.fillText(`${sign}${Math.round(edge.strength * 100)}%`, labelX, labelY);
      }
    }

    // Draw nodes
    for (const node of nodesRef.current) {
      const isHov = hoveredRef.current === node.id;
      const isHL2 = highlightNode === node.id;
      const isActive = isHov || isHL2;
      const isConnected = hl ? edges.some(e =>
        (e.cause === hl && e.effect === node.id) || (e.effect === hl && e.cause === node.id)
      ) || node.id === hl : true;
      const isDimmed = hl && !isConnected;

      const pulse = Math.sin(t * 1.5 + node.pulsePhase) * 0.08 + 1;
      const r = node.radius * (isActive ? 1.2 : 1) * pulse;
      const alpha = isDimmed ? 0.12 : 1;

      // What-if ripple effect
      const hasChange = (node.changePercent ?? 0) !== 0;
      if (hasChange) {
        const rippleR = r * (1.5 + Math.sin(t * 3 + node.pulsePhase) * 0.5);
        const rippleAlpha = 0.15 + Math.sin(t * 3 + node.pulsePhase) * 0.1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, rippleR, 0, Math.PI * 2);
        const isPos = (node.changePercent ?? 0) > 0;
        ctx.strokeStyle = isPos ? `rgba(99,230,190,${rippleAlpha})` : `rgba(248,113,113,${rippleAlpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Glow
      if (isActive || hasChange) {
        const glow = ctx.createRadialGradient(node.x, node.y, r * 0.5, node.x, node.y, r * 2.5);
        glow.addColorStop(0, node.color + "35");
        glow.addColorStop(1, node.color + "00");
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.globalAlpha = alpha;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(node.x - r * 0.3, node.y - r * 0.3, 0, node.x, node.y, r);
      grad.addColorStop(0, node.color + "30");
      grad.addColorStop(1, node.color + "10");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = node.color + (isActive ? "cc" : "66");
      ctx.lineWidth = isActive ? 2.5 : 1.5;
      ctx.stroke();

      // Icon
      ctx.font = `${r * 0.7}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.fillText(node.icon, node.x, node.y - 1);

      // Label
      ctx.font = `600 11px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = alpha < 0.5 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.8)";
      ctx.fillText(node.label, node.x, node.y + r + 14);

      // What-if change badge
      if (hasChange && alpha > 0.5) {
        const pct = node.changePercent ?? 0;
        const isPos = pct > 0;
        const badgeText = `${isPos ? "+" : ""}${Math.round(pct)}%`;
        ctx.font = "bold 11px system-ui";
        const tw = ctx.measureText(badgeText).width;
        const bx = node.x + r * 0.7;
        const by = node.y - r * 0.7;
        
        // Badge bg
        ctx.beginPath();
        const pad = 4;
        ctx.roundRect(bx - tw / 2 - pad, by - 7, tw + pad * 2, 14, 4);
        ctx.fillStyle = isPos ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)";
        ctx.fill();
        
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(badgeText, bx, by);
      }

      ctx.globalAlpha = 1;
    }

    animRef.current = requestAnimationFrame(draw);
  }, [size, edges, getNode, highlightNode, simulate]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  // Mouse interaction
  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const findNode = useCallback((x: number, y: number) => {
    for (const node of nodesRef.current) {
      const dx = x - node.x, dy = y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < node.radius * 1.3) return node;
    }
    return null;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const pos = getPos(e);
    if (!pos) return;

    if (dragRef.current) {
      const node = nodesRef.current.find(n => n.id === dragRef.current!.nodeId);
      if (node) {
        node.x = pos.x - dragRef.current.offsetX;
        node.y = pos.y - dragRef.current.offsetY;
        node.targetX = node.x;
        node.targetY = node.y;
        node.vx = 0;
        node.vy = 0;
      }
      return;
    }

    const found = findNode(pos.x, pos.y);
    hoveredRef.current = found?.id ?? null;
    setHovered(found?.id ?? null);
  }, [interactive, getPos, findNode]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const pos = getPos(e);
    if (!pos) return;
    const node = findNode(pos.x, pos.y);
    if (node) {
      dragRef.current = { nodeId: node.id, offsetX: pos.x - node.x, offsetY: pos.y - node.y };
    }
  }, [interactive, getPos, findNode]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragRef.current) {
      const pos = getPos(e);
      if (pos) {
        const node = findNode(pos.x, pos.y);
        // Only trigger click if we didn't drag much
        if (node && node.id === dragRef.current.nodeId) {
          const dx = pos.x - (node.x + dragRef.current.offsetX);
          const dy = pos.y - (node.y + dragRef.current.offsetY);
          if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            onNodeClick?.(node.id);
          }
        }
      }
      dragRef.current = null;
    }
  }, [getPos, findNode, onNodeClick]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || !onNodeClick) return;
    const pos = getPos(e);
    if (!pos) return;
    const node = findNode(pos.x, pos.y);
    if (node) onNodeClick(node.id);
  }, [interactive, onNodeClick, getPos, findNode]);

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { hoveredRef.current = null; setHovered(null); dragRef.current = null; }}
        style={{ cursor: dragRef.current ? "grabbing" : hovered ? "grab" : "default", touchAction: "none" }}
        className="w-full h-full"
      />
    </div>
  );
}
