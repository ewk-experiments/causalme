"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { NODES, EDGES, CausalNode } from "@/lib/mock-data";

interface Props {
  width?: number;
  height?: number;
  onNodeClick?: (node: CausalNode) => void;
  highlightNode?: string | null;
  interactive?: boolean;
}

interface SimNode extends CausalNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

export default function CausalGraph({ width = 800, height = 600, onNodeClick, highlightNode, interactive = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const hoveredRef = useRef<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Initialize nodes in a circle
  useEffect(() => {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.32;
    nodesRef.current = NODES.map((n, i) => {
      const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...n,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        radius: 36,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    });
  }, [width, height]);

  const getNode = useCallback((id: string) => nodesRef.current.find(n => n.id === id), []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    timeRef.current += 0.016;
    const t = timeRef.current;

    ctx.clearRect(0, 0, width, height);

    // Draw edges
    for (const edge of EDGES) {
      const src = getNode(edge.source);
      const tgt = getNode(edge.target);
      if (!src || !tgt) continue;

      const isHighlighted = highlightNode
        ? edge.source === highlightNode || edge.target === highlightNode
        : hoveredRef.current
          ? edge.source === hoveredRef.current || edge.target === hoveredRef.current
          : false;

      const alpha = isHighlighted ? 0.8 : (highlightNode || hoveredRef.current) ? 0.08 : 0.2;
      const lineWidth = isHighlighted ? 2.5 : 1;

      // Gradient edge
      const grad = ctx.createLinearGradient(src.x, src.y, tgt.x, tgt.y);
      const edgeColor = edge.weight > 0 ? "99, 102, 241" : "239, 68, 68";
      grad.addColorStop(0, `rgba(${edgeColor}, ${alpha})`);
      grad.addColorStop(1, `rgba(${edgeColor}, ${alpha * 0.5})`);

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = lineWidth;

      // Curved edges
      const mx = (src.x + tgt.x) / 2;
      const my = (src.y + tgt.y) / 2;
      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const nx = -dy * 0.15;
      const ny = dx * 0.15;

      ctx.moveTo(src.x, src.y);
      ctx.quadraticCurveTo(mx + nx, my + ny, tgt.x, tgt.y);
      ctx.stroke();

      // Animated particle along edge
      if (isHighlighted) {
        const pt = ((t * 0.5 + Math.abs(edge.weight)) % 1);
        const tt = pt;
        const px = (1 - tt) * (1 - tt) * src.x + 2 * (1 - tt) * tt * (mx + nx) + tt * tt * tgt.x;
        const py = (1 - tt) * (1 - tt) * src.y + 2 * (1 - tt) * tt * (my + ny) + tt * tt * tgt.y;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = edge.weight > 0 ? "rgba(99, 102, 241, 0.9)" : "rgba(239, 68, 68, 0.9)";
        ctx.fill();
      }

      // Arrow
      if (isHighlighted) {
        const at = 0.85;
        const ax = (1 - at) * (1 - at) * src.x + 2 * (1 - at) * at * (mx + nx) + at * at * tgt.x;
        const ay = (1 - at) * (1 - at) * src.y + 2 * (1 - at) * at * (my + ny) + at * at * tgt.y;
        const at2 = 0.83;
        const ax2 = (1 - at2) * (1 - at2) * src.x + 2 * (1 - at2) * at2 * (mx + nx) + at2 * at2 * tgt.x;
        const ay2 = (1 - at2) * (1 - at2) * src.y + 2 * (1 - at2) * at2 * (my + ny) + at2 * at2 * tgt.y;
        const angle = Math.atan2(ay - ay2, ax - ax2);
        const arrowSize = 8;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - arrowSize * Math.cos(angle - 0.4), ay - arrowSize * Math.sin(angle - 0.4));
        ctx.lineTo(ax - arrowSize * Math.cos(angle + 0.4), ay - arrowSize * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fillStyle = `rgba(${edgeColor}, ${alpha})`;
        ctx.fill();
      }
    }

    // Draw nodes
    for (const node of nodesRef.current) {
      const isHovered = hoveredRef.current === node.id;
      const isHighlightedNode = highlightNode === node.id;
      const isActive = isHovered || isHighlightedNode;
      const isDimmed = (highlightNode || hoveredRef.current) && !isActive &&
        !EDGES.some(e =>
          (e.source === (highlightNode || hoveredRef.current) && e.target === node.id) ||
          (e.target === (highlightNode || hoveredRef.current) && e.source === node.id)
        );

      const pulse = Math.sin(t * 2 + node.pulsePhase) * 0.1 + 1;
      const r = node.radius * (isActive ? 1.15 : 1) * pulse;
      const alpha = isDimmed ? 0.15 : 1;

      // Glow
      if (isActive) {
        const glow = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, r * 2.5);
        glow.addColorStop(0, node.color + "40");
        glow.addColorStop(1, node.color + "00");
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = alpha < 1 ? node.color + "25" : node.color + "15";
      ctx.fill();
      ctx.strokeStyle = alpha < 1 ? node.color + "30" : node.color;
      ctx.lineWidth = isActive ? 3 : 2;
      ctx.stroke();

      // Icon
      ctx.font = `${r * 0.6}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = alpha;
      ctx.fillText(node.icon, node.x, node.y - 2);

      // Label
      ctx.font = `600 11px var(--font-sans), system-ui, sans-serif`;
      ctx.fillStyle = alpha < 1 ? "#94a3b8" : "#334155";
      ctx.fillText(node.label, node.x, node.y + r + 14);

      ctx.globalAlpha = 1;
    }

    animRef.current = requestAnimationFrame(draw);
  }, [width, height, getNode, highlightNode]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found: string | null = null;
    for (const node of nodesRef.current) {
      const dx = mx - node.x;
      const dy = my - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < node.radius * 1.2) {
        found = node.id;
        break;
      }
    }
    hoveredRef.current = found;
    setHovered(found);
  }, [interactive]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || !onNodeClick) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const node of nodesRef.current) {
      const dx = mx - node.x;
      const dy = my - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < node.radius * 1.2) {
        onNodeClick(node);
        break;
      }
    }
  }, [interactive, onNodeClick]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { hoveredRef.current = null; setHovered(null); }}
      onClick={handleClick}
      style={{ cursor: hovered ? "pointer" : "default" }}
      className="w-full h-full"
    />
  );
}
