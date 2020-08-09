import { orientationToMeasure } from '../../../utils';
import { generateDraggerEffectKey } from './utils';
import Dragger from '../../../Dragger';
import { Action } from 'sabar';
import { OnMoveHandleContext, OnMoveArgs } from 'types';

const handleImpactDraggerEffect = (args: any, ctx: object, actions: Action) => {
  const { liftUpVDragger } = args as OnMoveArgs;
  const context = ctx as OnMoveHandleContext;
  const {
    impactRawInfo,
    dndEffects,
    dndConfig: { withPlaceholder },
  } = context;

  const { impactVContainer, impactPosition, candidateVDragger } = impactRawInfo;

  if (withPlaceholder || !impactVContainer) {
    actions.next();
    return;
  }

  const {
    containerConfig: { orientation, impactDraggerEffect },
  } = impactVContainer;

  const effectsManager = dndEffects.find(impactVContainer.id);

  const measure = orientationToMeasure(orientation);
  const positionIndex = measure.indexOf(impactPosition as string);

  if (typeof impactDraggerEffect === 'function') {
    const effectKey = generateDraggerEffectKey(
      impactVContainer,
      candidateVDragger as Dragger,
      impactPosition as any
    );
    const index = effectsManager.impactDraggerEffects.findIndex(
      ({ key }) => key === effectKey
    );

    if (index === -1) {
      effectsManager.clearImpactDraggerEffects();

      const teardown = impactDraggerEffect({
        dragger: liftUpVDragger.el,
        container: impactVContainer.el,
        candidateDragger: (candidateVDragger as Dragger).el,
        shouldMove: !positionIndex,
        downstream: !positionIndex,
        placedPosition: impactPosition as any,
        dimension: (candidateVDragger as Dragger).dimension.rect,
        isHighlight: true,
      });

      effectsManager.impactDraggerEffects.push({
        teardown,
        vDragger: candidateVDragger as Dragger,
        key: effectKey,
      });
    }

    context.output = {
      dragger: liftUpVDragger.el,
      candidateDragger: (candidateVDragger as Dragger).el,
      container: impactVContainer.el,
      placedPosition: impactPosition as any,
    };
  }

  actions.next();
};

export default handleImpactDraggerEffect;
