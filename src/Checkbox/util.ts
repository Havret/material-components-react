import {
    ANIM_CHECKED_INDETERMINATE,
    ANIM_CHECKED_UNCHECKED,
    ANIM_INDETERMINATE_CHECKED,
    ANIM_INDETERMINATE_UNCHECKED,
    ANIM_UNCHECKED_CHECKED,
    ANIM_UNCHECKED_INDETERMINATE,
    CheckState
} from './constants';
import { CheckboxProps } from './Checkbox';

function determineCheckState(nextProps: Partial<CheckboxProps>): CheckState {
    if (nextProps.indeterminate) {
        return CheckState.indeterminate;
    }

    return nextProps.checked ? CheckState.checked : CheckState.unchecked;
}

function getTransitionAnimationClass(oldCheckState: CheckState, newCheckState: CheckState): string {
    switch (oldCheckState) {
        case CheckState.unchecked:
            return newCheckState === CheckState.checked ? ANIM_UNCHECKED_CHECKED : ANIM_UNCHECKED_INDETERMINATE;
        case CheckState.checked:
            return newCheckState === CheckState.unchecked ? ANIM_CHECKED_UNCHECKED : ANIM_CHECKED_INDETERMINATE;
        // CheckState.indeterminate:
        default:
            return newCheckState === CheckState.checked ? ANIM_INDETERMINATE_CHECKED : ANIM_INDETERMINATE_UNCHECKED;
    }
}

export { determineCheckState, getTransitionAnimationClass };