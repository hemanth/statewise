import React from "react";
import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import atlas from "us-atlas/states-albers-10m.json";
import {
  states as usStates,
  colors as usColors,
  displayRegion as usDisplayRegion,
} from "./data";
import {
  states as inStates,
  colors as inColors,
  displayRegion as inDisplayRegion,
  smallStates as inSmallStates,
} from "./india-data";
import indiaFeatures from "./india-geo.json";

const usPath = geoPath();
const usFeatures = feature(atlas, atlas.objects.states).features.filter((f) =>
  usStates.some((s) => s.id === f.id),
);
const usSmall = ["RI", "DE", "CT", "MA", "NJ", "MD", "VT", "NH"];

export default function Map({
  country = "us",
  selected,
  onSelect,
  region,
  labels = true,
  quiz = false,
  zoom = 1,
  result = null,
}) {
  const isIndia = country === "in";
  const states = isIndia ? inStates : usStates;
  const colors = isIndia ? inColors : usColors;
  const displayRegion = isIndia ? inDisplayRegion : usDisplayRegion;
  const small = isIndia ? inSmallStates : usSmall;

  const viewBox = isIndia ? "0 0 900 960" : "-25 -15 1025 655";
  const transform = isIndia
    ? `translate(${450 * (1 - zoom)}px, ${480 * (1 - zoom)}px) scale(${zoom})`
    : `translate(${487 * (1 - zoom)}px, ${300 * (1 - zoom)}px) scale(${zoom})`;

  const items = isIndia
    ? indiaFeatures.map((f, i) => {
        const s = states.find((st) => st.id === f.id);
        return {
          key: `${f.id}-${i}`,
          id: f.id,
          state: s,
          d: f.d,
          centroid: f.centroid,
        };
      })
    : usFeatures.map((f) => {
        const s = states.find((st) => st.id === f.id);
        return {
          key: s.id,
          id: s.id,
          state: s,
          d: usPath(f),
          centroid: usPath.centroid(f),
        };
      });

  // Find selected small state item for leader line & beacon
  const selectedSmallItem = items.find(
    (it) => it.id === selected && small.includes(it.state?.abbr),
  );
  const selectedSmallIndex = selectedSmallItem
    ? small.indexOf(selectedSmallItem.state?.abbr)
    : -1;

  let leaderLine = null;
  if (selectedSmallItem && selectedSmallIndex !== -1 && labels && !quiz) {
    const badgeX = (isIndia ? 680 + (selectedSmallIndex % 2) * 58 : 875 + (selectedSmallIndex % 2) * 58) + 24;
    const badgeY = (isIndia
      ? 580 + Math.floor(selectedSmallIndex / 2) * 35
      : 310 + Math.floor(selectedSmallIndex / 2) * 33) + 12;
    const [cx, cy] = selectedSmallItem.centroid;
    const midX = (cx + badgeX) / 2;
    const midY = (cy + badgeY) / 2 - 15;
    leaderLine = `M ${cx} ${cy} Q ${midX} ${midY} ${badgeX} ${badgeY}`;
  }

  return (
    <svg
      className={`us-map ${isIndia ? "india-map" : ""} ${result ? "map-revealed" : ""}`}
      viewBox={viewBox}
      aria-label={
        isIndia
          ? "Interactive map of India's states and union territories"
          : "Interactive map of the 50 United States"
      }
    >
      <g style={{ transform }}>
        {items.map((item) => {
          const s = item.state;
          if (!s) return null;
          const [x, y] = item.centroid;
          const isSelected = selected === s.id;
          const correct = result?.correctId === s.id;
          const wrong = result?.chosenId === s.id && !correct;
          const isSmall = small.includes(s.abbr);
          return (
            <g
              key={item.key}
              className={`state ${correct ? "answer-correct" : wrong ? "answer-wrong" : ""} ${isSelected ? "selected" : ""} ${region !== "All regions" && displayRegion(s) !== region ? "dim" : ""}`}
            >
              <path
                d={item.d}
                fill={colors[displayRegion(s)]}
                tabIndex={result ? -1 : 0}
                role="button"
                aria-disabled={!!result}
                aria-label={quiz && !result ? "Choose state on map" : s.name}
                onClick={() => {
                  if (!result) onSelect(s.id);
                }}
                onKeyDown={(e) => {
                  if (!result && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelect(s.id);
                  }
                }}
              >
                <title>{quiz && !result ? "Select this state" : s.name}</title>
              </path>
              {labels && !quiz && !isSmall && (
                <text x={x} y={y} dy=".35em">
                  {s.abbr}
                </text>
              )}
              {isSelected && isSmall && (
                <g
                  className="small-state-beacon"
                  transform={`translate(${x},${y})`}
                  pointerEvents="none"
                  aria-hidden="true"
                >
                  <circle r="16" fill="rgba(51, 93, 69, 0.18)" stroke="#253d2a" strokeWidth="2" />
                  <circle r="5" fill="#253d2a" />
                  <text y="-20" textAnchor="middle" className="small-state-beacon-label">
                    {s.name}
                  </text>
                </g>
              )}
              {(correct || wrong) && (
                <g
                  className={`answer-marker ${correct ? "correct-marker" : "wrong-marker"}`}
                  transform={`translate(${x},${y})`}
                  aria-hidden="true"
                >
                  <circle r="12" />
                  {correct ? (
                    <path d="M-5 0 L-1 4 L6-4" />
                  ) : (
                    <path d="M-4-4 L4 4 M4-4 L-4 4" />
                  )}
                </g>
              )}
            </g>
          );
        })}
      </g>

      {leaderLine && (
        <path d={leaderLine} className="small-state-leader" aria-hidden="true" />
      )}

      {labels && !quiz && (
        <g className={`small-states ${isIndia ? "small-states-india" : ""}`}>
          <text
            x={isIndia ? 738 : 933}
            y={isIndia ? 562 : 295}
            textAnchor="middle"
            className="small-states-title"
          >
            {isIndia ? "SMALL STATES & UTs" : "SMALL STATES"}
          </text>
          {small.map((abbr, i) => {
            const s = states.find((st) => st.abbr === abbr);
            if (!s) return null;
            const isSelected = selected === s.id;
            const isDim = region !== "All regions" && displayRegion(s) !== region;
            const tx = isIndia ? 680 + (i % 2) * 58 : 875 + (i % 2) * 58;
            const ty = isIndia
              ? 580 + Math.floor(i / 2) * 35
              : 310 + Math.floor(i / 2) * 33;
            return (
              <g
                key={abbr}
                role="button"
                tabIndex="0"
                className={`small-state-badge ${isSelected ? "selected" : ""} ${isDim ? "dim" : ""}`}
                aria-label={`Select ${s.name}`}
                aria-pressed={isSelected}
                onClick={() => onSelect(s.id)}
                onKeyDown={(e) => e.key === "Enter" && onSelect(s.id)}
                transform={`translate(${tx},${ty})`}
              >
                <rect
                  width="48"
                  height="25"
                  rx="6"
                  fill={colors[displayRegion(s)]}
                />
                <text x="24" y="17">
                  {abbr}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
