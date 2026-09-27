import type { ThreeDPartDefinition } from './types';

interface PartInfoPanelProps {
  part: ThreeDPartDefinition | undefined;
  stateDescription: string;
}

export function PartInfoPanel({ part, stateDescription }: PartInfoPanelProps) {
  return (
    <aside className="three-d-part-info" aria-live="polite">
      <h4>{part ? part.label : 'Vyber součást'}</h4>
      <p>
        {part?.description ??
          'Klikni na součást ve scéně nebo použij klávesnicí seznam součástí pod scénou.'}
      </p>
      {part && <p className="three-d-part-info__state">{stateDescription}</p>}
    </aside>
  );
}
