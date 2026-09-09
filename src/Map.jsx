import React from "react";
import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import atlas from "us-atlas/states-albers-10m.json";
import { states, colors, displayRegion } from "./data";
const path = geoPath();
const features = feature(atlas, atlas.objects.states).features.filter((f) =>
  states.some((s) => s.id === f.id),
);
const small = ["RI", "DE", "CT", "MA", "NJ", "MD", "VT", "NH"];
export default function Map({
  selected,
  onSelect,
  region,
  labels = true,
  quiz = false,
  zoom = 1,
  result = null,
}) {
  return (
    <svg
      className={`us-map ${result ? "map-revealed" : ""}`}
      viewBox="-25 -15 1025 655"
      aria-label="Interactive map of the 50 United States"
    >
      <g
        style={{
          transform: `translate(${487 * (1 - zoom)}px, ${300 * (1 - zoom)}px) scale(${zoom})`,
        }}
      >
        {features.map((f) => {
          const s = states.find((s) => s.id === f.id);
          const [x, y] = path.centroid(f);
          const correct = result?.correctId === s.id;
          const wrong = result?.chosenId === s.id && !correct;
          return (
            <g
              key={s.id}
              className={`state ${correct ? "answer-correct" : wrong ? "answer-wrong" : ""} ${selected === s.id ? "selected" : ""} ${region !== "All regions" && displayRegion(s) !== region ? "dim" : ""}`}
            >
              <path
                d={path(f)}
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
              {labels && !quiz && !small.includes(s.abbr) && (
                <text x={x} y={y} dy=".35em">
                  {s.abbr}
                </text>
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
      {labels && !quiz && (
        <g className="small-states">
          {small.map((abbr, i) => {
            const s = states.find((s) => s.abbr === abbr);
            return (
              <g
                key={abbr}
                role="button"
                tabIndex="0"
                aria-label={`Select ${s.name}`}
                onClick={() => onSelect(s.id)}
                onKeyDown={(e) => e.key === "Enter" && onSelect(s.id)}
                transform={`translate(${875 + (i % 2) * 58},${310 + Math.floor(i / 2) * 33})`}
              >
                <rect
                  width="48"
                  height="25"
                  rx="5"
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
