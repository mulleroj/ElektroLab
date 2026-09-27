import type { SeriesParallelScenarioId } from '../demos/SeriesParallelDemo';
import type { SeriesParallel3DState } from './SeriesParallelModel';

export function derive3DState(
  scenarioId: SeriesParallelScenarioId,
  stepIndex: number,
): SeriesParallel3DState {
  const serial = scenarioId === 'serial' || scenarioId === 'serial-fault';
  const parallel = !serial;
  const serialFault = scenarioId === 'serial-fault';
  const parallelFault = scenarioId === 'parallel-fault';
  const normal = !serialFault && !parallelFault || stepIndex === 0;
  const serialActive = serial && (serialFault ? normal : stepIndex >= 1);
  const upperActive = parallel && (parallelFault ? normal : stepIndex >= 2);
  const lowerActive = parallel && (parallelFault || stepIndex >= 2);
  const feedReturnActive = parallel && (parallelFault || stepIndex >= 3);
  const flowVisible = serial
    ? serialFault
      ? normal
      : stepIndex === 3
    : parallelFault
      ? stepIndex === 0 || stepIndex === 2
      : stepIndex === 3;

  const activePartIds = new Set<string>();
  if (serialActive) {
    activePartIds.add('wire-series');
    activePartIds.add('wire-return');
  }
  if (feedReturnActive) {
    activePartIds.add('wire-feed');
    activePartIds.add('wire-return');
  }
  if (upperActive) activePartIds.add('branch-upper');
  if (lowerActive) activePartIds.add('branch-lower');

  const litPartIds = new Set<string>();
  const faultyPartIds = new Set<string>();
  const highlightedPartIds = new Set<string>();
  if (serial) {
    if (normal && (stepIndex === 4 || (serialFault && stepIndex === 0))) {
      litPartIds.add('bulb-1');
      litPartIds.add('bulb-2');
    }
    if (serialFault && !normal) faultyPartIds.add('bulb-1');
  } else {
    if (normal && (stepIndex === 4 || (parallelFault && stepIndex === 0))) {
      litPartIds.add('bulb-1');
      litPartIds.add('bulb-2');
    }
    if (parallelFault && !normal) {
      faultyPartIds.add('bulb-1');
      litPartIds.add('bulb-2');
    }
    if (scenarioId === 'parallel' && stepIndex === 1) {
      highlightedPartIds.add('node-split');
      highlightedPartIds.add('node-merge');
    }
  }

  return {
    activePartIds,
    litPartIds,
    faultyPartIds,
    highlightedPartIds,
    flowVisible,
  };
}
