import expect from 'expect';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('keepOffspring action', () => {
  const interactionType = "select-chromosomes",
        userDrakeIndex = 0, 
        maxDrakes = 6, 
        shouldKeepSourceDrake = false,
        
        alleleString =  "a:T,b:T,a:m,b:m,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:fl,b:fl,a:hl,b:Hl,a:A1,b:A1,a:D,b:D,a:Bog,b:Bog,a:rh,b:rh",
        // different genotype, same phenotype/image
        similarAlleleString = "a:T,b:T,a:m,b:m,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:fl,b:fl,a:hl,b:Hl,a:A1,b:A1,a:D,b:D,a:Bog,b:Bog,a:rh,b:rh";
        
  it('should create a function which dispatches the correct action when an offspring is kept', () => {
    const keptDrakeIndices = [],
          keepOffspringAction = { 
            type: types.OFFSPRING_KEPT, 
            interactionType, 
            index: userDrakeIndex, 
            success: true, 
            incrementMoves: false, 
            shouldKeepSourceDrake
          };

    const dispatch = expect.createSpy(),
          getState = expect.createSpy().andReturn({
            drakes: [{
              alleleString: alleleString,
              sex: 1
            }],
            interactionType: interactionType
          });

    actions.keepOffspring(userDrakeIndex, keptDrakeIndices, maxDrakes, shouldKeepSourceDrake)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(keepOffspringAction);
    expect(dispatch.calls.length).toBe(1);
  });

  it('should create a function which dispatches a failed action when a duplicate offspring is kept', () => {
    const keptDrakeIndices = [1],
          keepOffspringAction = { 
            type: types.OFFSPRING_KEPT, 
            interactionType, 
            index: userDrakeIndex, 
            success: false, 
            incrementMoves: true, 
            shouldKeepSourceDrake 
          };

    const dispatch = expect.createSpy(),
          getState = expect.createSpy().andReturn({
            drakes: [{
              alleleString: alleleString,
              sex: 1
            },
            {
              alleleString: similarAlleleString,
              sex: 1
            }],
            interactionType: interactionType
          });

    actions.keepOffspring(userDrakeIndex, keptDrakeIndices, maxDrakes, shouldKeepSourceDrake)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(keepOffspringAction);
    expect(dispatch.calls.length).toBe(2); // Keep offspring and failure actions are dispatched
  });
});
