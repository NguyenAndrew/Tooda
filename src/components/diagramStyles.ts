/**
 * Shared visual constants and styles used across the 2-D and 3-D diagram
 * components (HealthcarePlatform2D, HealthcarePlatform3D, and
 * FeaturesVisualization3D).
 *
 * Centralizing these prevents the same values from drifting out of sync
 * across components and eliminates the repeated style objects that previously
 * existed in each file.
 */

/** Pixels the label floats above the node's screen-space centre (3-D views). */
export const LABEL_VERTICAL_OFFSET = 68;

/** Icon row inside always-visible node labels (3-D views). */
export const LABEL_ICON_STYLE: React.CSSProperties = {
  fontSize: '1.1rem',
  lineHeight: 1,
};

/** Text row inside always-visible node labels (3-D views). */
export const LABEL_TEXT_STYLE: React.CSSProperties = {
  fontSize: '0.65rem',
  color: '#cbd5e1',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  marginTop: '2px',
};

/** Wrapper div that positions each always-visible label (3-D views). */
export const LABEL_CONTAINER_STYLE: React.CSSProperties = {
  position: 'absolute',
  transform: 'translateX(-50%)',
  pointerEvents: 'none',
  textAlign: 'center',
  visibility: 'hidden',
};

/**
 * Base tooltip style shared by all three diagram components.
 *
 * Individual components spread this object and add any position-specific
 * properties they require (e.g. `display`, `bottom`, `right`, or dynamic
 * `left`/`top` values set via JavaScript).
 */
export const TOOLTIP_BASE_STYLE: React.CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(99,102,241,0.4)',
  borderRadius: '0.75rem',
  padding: '10px 14px',
  maxWidth: '220px',
  backdropFilter: 'blur(8px)',
  zIndex: 10,
  lineHeight: 1.4,
  textAlign: 'center',
};
