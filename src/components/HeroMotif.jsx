import React, { useEffect, useRef, useState } from "react";
import { COL } from "../data";

/**
 * Hero motif: 6 buildings forming an architectural ensemble.
 * Each building completes with its own roof type:
 *   - Penthouse setback (luxury rooftop volume + terrace)
 *   - Pitched roof (traditional Nordic gable)
 *   - Terrace-garden (flat roof with greenery + parapet)
 */

const ISO_X = 0.866;
const ISO_Y = 0.5;
const OFFSET_X = 50;
const OFFSET_Y = 18;

function iso(x, y, z) {
  return {
    x: (x - y) * ISO_X + OFFSET_X,
    y: (x + y) * ISO_Y - z + OFFSET_Y,
  };
}

const BUILDINGS = [
  // Back row
  { id: "B", x: 12, y: 20, w: 10, d: 8, floors: 7,  floorH: 3.0, buildOrder: 0, roof: "penthouse" },
  { id: "A", x: 30, y: 14, w: 11, d: 9, floors: 10, floorH: 3.0, buildOrder: 2, roof: "penthouse-garden" },
  { id: "C", x: 46, y: 20, w: 9,  d: 8, floors: 5,  floorH: 3.0, buildOrder: 1, roof: "pitched" },
  // Front row
  { id: "D", x: 8,  y: 42, w: 9,  d: 7, floors: 4,  floorH: 3.0, buildOrder: 3, roof: "pitched" },
  { id: "E", x: 24, y: 42, w: 10, d: 7, floors: 6,  floorH: 3.0, buildOrder: 4, roof: "terrace-garden" },
  { id: "F", x: 42, y: 42, w: 9,  d: 7, floors: 5,  floorH: 3.0, buildOrder: 5, roof: "pitched" },
];

const BUILD_FLOOR_TIME = 0.45;
const BUILD_FLOOR_DELAY = 0.22;
const BUILD_OFFSET = 0.85;
const HOLD_TIME = 4.0;
const FADE_TIME = 1.6;

const maxFloors = Math.max(...BUILDINGS.map((b) => b.floors));
const constructionDuration =
  maxFloors * (BUILD_FLOOR_TIME + BUILD_FLOOR_DELAY) +
  (BUILDINGS.length - 1) * BUILD_OFFSET +
  0.8; // extra time for roofs to settle in
const TOTAL_CYCLE = constructionDuration + HOLD_TIME + FADE_TIME;

export default function HeroMotif() {
  const containerRef = useRef(null);
  const [time, setTime] = useState(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const [, forceTick] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      setTime((now - start) / 1000);
      const lerp = 0.06;
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * lerp;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * lerp;
      forceTick((t) => (t + 1) % 100000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      };
    };
    const onLeave = () => { mouseRef.current = { x: 0, y: 0 }; };
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const mx = smoothMouseRef.current.x;
  const my = smoothMouseRef.current.y;
  const cycleTime = time % TOTAL_CYCLE;
  const cycleOpacity =
    cycleTime > constructionDuration + HOLD_TIME
      ? Math.max(0, 1 - (cycleTime - constructionDuration - HOLD_TIME) / FADE_TIME)
      : 1;

  function getBuildingFloorProgress(building, floorIdx) {
    const buildingStart = building.buildOrder * BUILD_OFFSET;
    const start = buildingStart + floorIdx * (BUILD_FLOOR_TIME + BUILD_FLOOR_DELAY);
    const end = start + BUILD_FLOOR_TIME;
    if (cycleTime < start) return 0;
    if (cycleTime >= end) return 1;
    const t = (cycleTime - start) / BUILD_FLOOR_TIME;
    return 1 - Math.pow(1 - t, 3);
  }

  function topoPath(baseRadius, distortAmount, segments, phase, verticalSquash = 0.78) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r =
        baseRadius +
        Math.sin(angle * 3 + phase) * distortAmount +
        Math.sin(angle * 5 + phase * 1.7) * distortAmount * 0.45 +
        Math.sin(angle * 8 + phase * 2.3) * distortAmount * 0.2;
      const px = 50 + Math.cos(angle) * r;
      const py = 50 + Math.sin(angle) * r * verticalSquash;
      points.push(`${px.toFixed(2)},${py.toFixed(2)}`);
    }
    return `M ${points.join(" L ")} Z`;
  }

  const contourRings = [
    { r: 28, d: 1.3, opacity: 0.55, phaseSpeed: 0.05, weight: 0.15 },
    { r: 38, d: 1.8, opacity: 0.36, phaseSpeed: 0.04, weight: 0.13 },
    { r: 48, d: 2.4, opacity: 0.22, phaseSpeed: 0.035, weight: 0.11 },
    { r: 58, d: 3.0, opacity: 0.13, phaseSpeed: 0.03, weight: 0.10 },
  ];

  const sunPathProgress = (time * 0.025) % 1;
  const sunArcRadius = 50;
  const sunAngle = Math.PI * 1.05 + sunPathProgress * Math.PI * 0.9;
  const sunX = 50 + Math.cos(sunAngle) * sunArcRadius;
  const sunY = 50 + Math.sin(sunAngle) * sunArcRadius * 0.55;

  const landscapeOpacity =
    Math.min(1, Math.max(0, (cycleTime - 1.5) / 2)) * cycleOpacity;

  const renderOrder = [...BUILDINGS].sort(
    (a, b) => (a.x + a.y) - (b.x + b.y)
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ minHeight: 500 }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${50 + mx * 8}% ${50 + my * 6}%, ${COL.paperWarm} 0%, transparent 75%)`,
        }}
      />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <filter id="bn-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bn-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={COL.card} />
            <stop offset="100%" stopColor={COL.paperDeep} />
          </linearGradient>
          <linearGradient id="bn-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COL.paperWarm} stopOpacity="0.95" />
            <stop offset="100%" stopColor={COL.border} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="bn-right" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COL.border} />
            <stop offset="100%" stopColor={COL.paperDeep} />
          </linearGradient>
          <linearGradient id="bn-pitch-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COL.paperDeep} />
            <stop offset="100%" stopColor={COL.border} />
          </linearGradient>
          <linearGradient id="bn-pitch-side" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={COL.borderSoft} />
            <stop offset="100%" stopColor={COL.paperDeep} />
          </linearGradient>
          <radialGradient id="bn-shadow">
            <stop offset="0%" stopColor={COL.ink} stopOpacity="0.18" />
            <stop offset="100%" stopColor={COL.ink} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Topographic contours */}
        <g fill="none" transform={`translate(${mx * 1.2}, ${my * 0.6})`}>
          {contourRings.map((ring, i) => (
            <path
              key={`ring-${i}`}
              d={topoPath(ring.r, ring.d, 80, time * ring.phaseSpeed + i * 0.6)}
              stroke={COL.ink}
              strokeWidth={ring.weight}
              opacity={ring.opacity * 0.5}
            />
          ))}
        </g>

        {/* Sun arc */}
        <g>
          <path
            d={`M ${50 + Math.cos(Math.PI * 1.05) * sunArcRadius} ${50 + Math.sin(Math.PI * 1.05) * sunArcRadius * 0.55}
                A ${sunArcRadius} ${sunArcRadius * 0.55} 0 0 1
                ${50 + Math.cos(Math.PI * 1.05 + Math.PI * 0.9) * sunArcRadius} ${50 + Math.sin(Math.PI * 1.05 + Math.PI * 0.9) * sunArcRadius * 0.55}`}
            fill="none"
            stroke={COL.gold}
            strokeWidth="0.1"
            opacity="0.22"
            strokeDasharray="0.6 1.2"
          />
          <circle cx={sunX} cy={sunY} r="2.0" fill={COL.gold} opacity="0.16" filter="url(#bn-soft)" />
          <circle cx={sunX} cy={sunY} r="1.0" fill={COL.gold} filter="url(#bn-soft)" />
        </g>

        {/* Building shadows */}
        <g opacity={cycleOpacity}>
          {BUILDINGS.map((b) => {
            const center = iso(b.x + b.w / 2, b.y + b.d / 2, 0);
            return (
              <ellipse
                key={`shadow-${b.id}`}
                cx={center.x}
                cy={center.y + 1}
                rx={b.w * 0.55}
                ry={b.d * 0.32}
                fill="url(#bn-shadow)"
              />
            );
          })}
        </g>

        {/* Landscape: courtyard between rows */}
        <g opacity={landscapeOpacity}>
          {(() => {
            const pathStart = iso(28, 50, 0);
            const pathEnd = iso(28, 35, 0);
            return (
              <line
                x1={pathStart.x}
                y1={pathStart.y}
                x2={pathEnd.x}
                y2={pathEnd.y}
                stroke={COL.muted}
                strokeWidth="0.3"
                opacity="0.4"
                strokeDasharray="0.5 0.7"
              />
            );
          })()}

          {(() => {
            const a = iso(16, 33, 0);
            const b = iso(20, 33, 0);
            const c = iso(20, 34.5, 0);
            const d = iso(16, 34.5, 0);
            return (
              <path
                d={`M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y} L ${d.x} ${d.y} Z`}
                fill={COL.paperDeep}
                stroke={COL.muted}
                strokeWidth="0.1"
                opacity="0.7"
              />
            );
          })()}

          {(() => {
            const treeBaseGrid = { x: 36, y: 33 };
            const treeBase = iso(treeBaseGrid.x, treeBaseGrid.y, 0);
            const treeTop = iso(treeBaseGrid.x, treeBaseGrid.y, 5);
            const crownCenter = iso(treeBaseGrid.x, treeBaseGrid.y, 6.5);
            const crownPoints = [];
            for (let i = 0; i <= 24; i++) {
              const a = (i / 24) * Math.PI * 2;
              const breathe = Math.sin(time * 0.8 + i * 0.6) * 0.25;
              const r = 2.0 + Math.sin(a * 3 + time * 0.4) * 0.4 + breathe;
              crownPoints.push(`${(crownCenter.x + Math.cos(a) * r).toFixed(2)},${(crownCenter.y + Math.sin(a) * r * 1.1).toFixed(2)}`);
            }
            return (
              <g>
                <line
                  x1={treeBase.x}
                  y1={treeBase.y}
                  x2={treeTop.x}
                  y2={treeTop.y}
                  stroke={COL.ink}
                  strokeWidth="0.16"
                  opacity="0.8"
                />
                <path d={`M ${crownPoints.join(" L ")} Z`} fill={COL.sage} opacity="0.35" />
                <path
                  d={`M ${crownPoints.join(" L ")} Z`}
                  fill="none"
                  stroke={COL.sage}
                  strokeWidth="0.13"
                  opacity="0.7"
                />
              </g>
            );
          })()}

          {[
            { x: 22, y: 30 },
            { x: 40, y: 36 },
            { x: 50, y: 32 },
            { x: 32, y: 38 },
          ].map((bush, i) => {
            const bushPos = iso(bush.x, bush.y, 0);
            const bushTop = iso(bush.x, bush.y, 1.2);
            return (
              <circle
                key={`bush-${i}`}
                cx={(bushPos.x + bushTop.x) / 2}
                cy={bushTop.y}
                r="0.7"
                fill={COL.sage}
                opacity="0.4"
              />
            );
          })}
        </g>

        {/* Buildings — back-to-front for correct occlusion */}
        <g opacity={cycleOpacity}>
          {renderOrder.map((b) => (
            <Building
              key={b.id}
              building={b}
              getProgress={(idx) => getBuildingFloorProgress(b, idx)}
              time={time}
            />
          ))}
        </g>

        {/* Drifting particles */}
        {[
          { x: 18, y: 22, phase: 0 },
          { x: 82, y: 30, phase: 2.0 },
          { x: 30, y: 80, phase: 4.0 },
          { x: 70, y: 78, phase: 6.0 },
        ].map((p, i) => {
          const drift = Math.sin(time * 0.3 + p.phase) * 1.5;
          const driftY = Math.cos(time * 0.25 + p.phase) * 1;
          const opacity = 0.25 + Math.sin(time * 0.9 + p.phase) * 0.2;
          return (
            <circle
              key={`particle-${i}`}
              cx={p.x + drift + mx * 1.5}
              cy={p.y + driftY + my * 1}
              r="0.3"
              fill={COL.gold}
              opacity={opacity}
              filter="url(#bn-soft)"
            />
          );
        })}
      </svg>
    </div>
  );
}

function Building({ building: b, getProgress, time }) {
  // Roof appears after the last floor reaches ~90%
  const lastFloorProgress = getProgress(b.floors - 1);
  const roofOpacity = Math.min(1, Math.max(0, (lastFloorProgress - 0.9) * 10));

  return (
    <g>
      {Array.from({ length: b.floors }).map((_, floorIdx) => {
        const z0 = floorIdx * b.floorH;
        const z1 = (floorIdx + 1) * b.floorH;
        const progress = getProgress(floorIdx);
        if (progress === 0) return null;

        const wallProgress = Math.max(0, (progress - 0.3) / 0.7);
        const slabProgress = Math.min(1, progress * 2);
        const currentZ = z0 + (z1 - z0) * wallProgress;
        const isCurrentlyBuilding = progress < 1;
        const isTopFloor = floorIdx === b.floors - 1;

        const tl = iso(b.x, b.y, currentZ);
        const tr = iso(b.x + b.w, b.y, currentZ);
        const tbl = iso(b.x, b.y + b.d, currentZ);
        const tbr = iso(b.x + b.w, b.y + b.d, currentZ);
        const bl = iso(b.x, b.y, z0);
        const br = iso(b.x + b.w, b.y, z0);
        const bbl = iso(b.x, b.y + b.d, z0);
        const bbr = iso(b.x + b.w, b.y + b.d, z0);

        const frontFace = `M ${bl.x} ${bl.y} L ${br.x} ${br.y} L ${tr.x} ${tr.y} L ${tl.x} ${tl.y} Z`;
        const rightFace = `M ${br.x} ${br.y} L ${bbr.x} ${bbr.y} L ${tbr.x} ${tbr.y} L ${tr.x} ${tr.y} Z`;

        // Show flat top only while THIS floor is in construction or while roof hasn't arrived yet
        const showTempTop = isTopFloor && progress >= 1 && roofOpacity < 1;

        return (
          <g key={floorIdx} opacity={slabProgress}>
            <path d={frontFace} fill="url(#bn-front)" stroke={COL.ink} strokeWidth="0.13" />
            <path d={rightFace} fill="url(#bn-right)" stroke={COL.ink} strokeWidth="0.13" />

            {progress >= 0.95 && isCurrentlyBuilding && (
              <g stroke={COL.gold} strokeWidth="0.22" fill="none" filter="url(#bn-soft)">
                <path d={`M ${tl.x} ${tl.y} L ${tr.x} ${tr.y} L ${tbr.x} ${tbr.y}`} />
              </g>
            )}

            {wallProgress > 0.6 && Array.from({ length: 3 }).map((_, wIdx) => {
              const wx = b.x + (wIdx + 1) * (b.w / 4);
              const a = iso(wx, b.y, z0);
              const bp = iso(wx, b.y, currentZ);
              return (
                <line
                  key={`w-${wIdx}`}
                  x1={a.x}
                  y1={a.y}
                  x2={bp.x}
                  y2={bp.y}
                  stroke={COL.inkSoft}
                  strokeWidth="0.06"
                  opacity={(wallProgress - 0.6) * 2.5}
                />
              );
            })}
            {wallProgress > 0.6 && Array.from({ length: 2 }).map((_, wIdx) => {
              const wy = b.y + (wIdx + 1) * (b.d / 3);
              const a = iso(b.x + b.w, wy, z0);
              const bp = iso(b.x + b.w, wy, currentZ);
              return (
                <line
                  key={`wr-${wIdx}`}
                  x1={a.x}
                  y1={a.y}
                  x2={bp.x}
                  y2={bp.y}
                  stroke={COL.inkSoft}
                  strokeWidth="0.06"
                  opacity={(wallProgress - 0.6) * 2.5}
                />
              );
            })}

            {showTempTop && (
              <path
                d={`M ${tl.x} ${tl.y} L ${tr.x} ${tr.y} L ${tbr.x} ${tbr.y} L ${tbl.x} ${tbl.y} Z`}
                fill="url(#bn-top)"
                stroke={COL.ink}
                strokeWidth="0.13"
                opacity={1 - roofOpacity}
              />
            )}
          </g>
        );
      })}

      {/* Architectural roof — fades in as building completes */}
      {roofOpacity > 0 && (
        <g opacity={roofOpacity}>
          <BuildingRoof b={b} />
        </g>
      )}
    </g>
  );
}

function BuildingRoof({ b }) {
  const roofZ = b.floors * b.floorH;
  const fl = iso(b.x, b.y, roofZ);
  const fr = iso(b.x + b.w, b.y, roofZ);
  const bl = iso(b.x, b.y + b.d, roofZ);
  const br = iso(b.x + b.w, b.y + b.d, roofZ);
  const flatRoofPath = `M ${fl.x} ${fl.y} L ${fr.x} ${fr.y} L ${br.x} ${br.y} L ${bl.x} ${bl.y} Z`;

  if (b.roof === "pitched") {
    // Ridge along x-axis at y=center, height 2.5
    const ridgeY = b.y + b.d / 2;
    const ridgeH = 2.5;
    const ridgeFront = iso(b.x, ridgeY, roofZ + ridgeH);
    const ridgeBackEnd = iso(b.x + b.w, ridgeY, roofZ + ridgeH);

    // Front roof slope: front-bottom-left, front-bottom-right, ridgeBackEnd, ridgeFront
    const frontPitch = `M ${fl.x} ${fl.y} L ${fr.x} ${fr.y} L ${ridgeBackEnd.x} ${ridgeBackEnd.y} L ${ridgeFront.x} ${ridgeFront.y} Z`;
    // Right gable triangle: front-right of wall top, back-right of wall top, ridge end on right
    const rightGable = `M ${fr.x} ${fr.y} L ${br.x} ${br.y} L ${ridgeBackEnd.x} ${ridgeBackEnd.y} Z`;

    return (
      <g>
        <path d={frontPitch} fill="url(#bn-pitch-front)" stroke={COL.ink} strokeWidth="0.13" />
        <path d={rightGable} fill="url(#bn-pitch-side)" stroke={COL.ink} strokeWidth="0.13" />
        {/* Ridge line accent */}
        <line
          x1={ridgeFront.x}
          y1={ridgeFront.y}
          x2={ridgeBackEnd.x}
          y2={ridgeBackEnd.y}
          stroke={COL.ink}
          strokeWidth="0.18"
          opacity="0.7"
        />
      </g>
    );
  }

  if (b.roof === "penthouse" || b.roof === "penthouse-garden") {
    // Inset penthouse box: 50% w, 55% d, shifted toward back
    const pw = b.w * 0.5;
    const pd = b.d * 0.55;
    const px = b.x + (b.w - pw) / 2;
    const py = b.y + (b.d - pd) * 0.4; // closer to back
    const ph = 2.6;

    const pBl = iso(px, py, roofZ);
    const pBr = iso(px + pw, py, roofZ);
    const pTl = iso(px, py, roofZ + ph);
    const pTr = iso(px + pw, py, roofZ + ph);
    const pBbr = iso(px + pw, py + pd, roofZ);
    const pTbr = iso(px + pw, py + pd, roofZ + ph);
    const pTbl = iso(px, py + pd, roofZ + ph);

    return (
      <g>
        {/* Flat roof terrace under penthouse */}
        <path d={flatRoofPath} fill="url(#bn-top)" stroke={COL.ink} strokeWidth="0.13" />

        {/* Garden patches on terrace (only for penthouse-garden) */}
        {b.roof === "penthouse-garden" && (() => {
          // Two organic sage patches on the visible terrace area (front of penthouse)
          const g1 = iso(b.x + b.w * 0.22, b.y + b.d * 0.18, roofZ);
          const g2 = iso(b.x + b.w * 0.82, b.y + b.d * 0.22, roofZ);
          return (
            <>
              <ellipse cx={g1.x} cy={g1.y} rx="1.1" ry="0.5" fill={COL.sage} opacity="0.55" />
              <ellipse cx={g2.x} cy={g2.y} rx="0.9" ry="0.4" fill={COL.sage} opacity="0.5" />
            </>
          );
        })()}

        {/* Subtle parapet line on outer terrace edge */}
        <path
          d={`M ${fl.x} ${fl.y} L ${fr.x} ${fr.y} L ${br.x} ${br.y}`}
          fill="none"
          stroke={COL.gold}
          strokeWidth="0.13"
          opacity="0.45"
        />

        {/* Penthouse box: front face */}
        <path
          d={`M ${pBl.x} ${pBl.y} L ${pBr.x} ${pBr.y} L ${pTr.x} ${pTr.y} L ${pTl.x} ${pTl.y} Z`}
          fill="url(#bn-front)"
          stroke={COL.ink}
          strokeWidth="0.12"
        />
        {/* Penthouse right face */}
        <path
          d={`M ${pBr.x} ${pBr.y} L ${pBbr.x} ${pBbr.y} L ${pTbr.x} ${pTbr.y} L ${pTr.x} ${pTr.y} Z`}
          fill="url(#bn-right)"
          stroke={COL.ink}
          strokeWidth="0.12"
        />
        {/* Penthouse top */}
        <path
          d={`M ${pTl.x} ${pTl.y} L ${pTr.x} ${pTr.y} L ${pTbr.x} ${pTbr.y} L ${pTbl.x} ${pTbl.y} Z`}
          fill="url(#bn-top)"
          stroke={COL.ink}
          strokeWidth="0.12"
        />
      </g>
    );
  }

  if (b.roof === "terrace-garden") {
    // Flat roof + sage garden patches + parapet
    const g1 = iso(b.x + b.w * 0.3, b.y + b.d * 0.35, roofZ);
    const g2 = iso(b.x + b.w * 0.7, b.y + b.d * 0.55, roofZ);
    const g3 = iso(b.x + b.w * 0.45, b.y + b.d * 0.7, roofZ);

    return (
      <g>
        <path d={flatRoofPath} fill="url(#bn-top)" stroke={COL.ink} strokeWidth="0.13" />
        <ellipse cx={g1.x} cy={g1.y} rx="1.4" ry="0.6" fill={COL.sage} opacity="0.5" />
        <ellipse cx={g2.x} cy={g2.y} rx="1.0" ry="0.45" fill={COL.sage} opacity="0.45" />
        <ellipse cx={g3.x} cy={g3.y} rx="0.7" ry="0.35" fill={COL.sage} opacity="0.4" />
        {/* Parapet accent line on visible edges */}
        <path
          d={`M ${fl.x} ${fl.y} L ${fr.x} ${fr.y} L ${br.x} ${br.y}`}
          fill="none"
          stroke={COL.gold}
          strokeWidth="0.13"
          opacity="0.4"
        />
      </g>
    );
  }

  // Fallback: flat top
  return <path d={flatRoofPath} fill="url(#bn-top)" stroke={COL.ink} strokeWidth="0.13" />;
}
