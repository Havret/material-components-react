import { CheckboxProps } from './Checkbox';
import { determineCheckState, getTransitionAnimationClass } from './util';
import {
    ANIM_CHECKED_INDETERMINATE,
    ANIM_CHECKED_UNCHECKED,
    ANIM_INDETERMINATE_CHECKED,
    ANIM_INDETERMINATE_UNCHECKED,
    ANIM_UNCHECKED_CHECKED,
    ANIM_UNCHECKED_INDETERMINATE,
    CheckState
} from './constants';

describe('Checkbox util: determineCheckState', () => {
    test('it should determine unchecked state', () => {
        // arrange
        const props: Partial<CheckboxProps> = {checked: false};

        // act
        const checkState = determineCheckState(props);

        // assert
        expect(checkState).toEqual(CheckState.unchecked);
    });

    test('it should determine checked state', () => {
        // arrange
        const props: Partial<CheckboxProps> = {checked: true};

        // act
        const checkState = determineCheckState(props);

        // assert
        expect(checkState).toEqual(CheckState.checked);
    });

    test('it should determine indeterminate state', () => {
        // arrange
        const props: Partial<CheckboxProps> = {indeterminate: true};

        // act
        const checkState = determineCheckState(props);

        // assert
        expect(checkState).toEqual(CheckState.indeterminate);
    });
});

describe('Checkbox util: getTransitionAnimationClass', () => {
    test('it should calculate unchecked to checked transition class', () => {
        // arrange
        const oldCheckState = CheckState.unchecked;
        const newCheckState = CheckState.checked;

        // act
        const animationClass = getTransitionAnimationClass(oldCheckState, newCheckState);

        // assert
        expect(animationClass).toEqual(ANIM_UNCHECKED_CHECKED);
    });

    test('it should calculate unchecked to indeterminate transition class', () => {
        // arrange
        const oldCheckState = CheckState.unchecked;
        const newCheckState = CheckState.indeterminate;

        // act
        const animationClass = getTransitionAnimationClass(oldCheckState, newCheckState);

        // assert
        expect(animationClass).toEqual(ANIM_UNCHECKED_INDETERMINATE);
    });

    test('it should calculate checked to unchecked transition class', () => {
        // arrange
        const oldCheckState = CheckState.checked;
        const newCheckState = CheckState.unchecked;

        // act
        const animationClass = getTransitionAnimationClass(oldCheckState, newCheckState);

        // assert
        expect(animationClass).toEqual(ANIM_CHECKED_UNCHECKED);
    });

    test('it should calculate checked to indeterminate transition class', () => {
        // arrange
        const oldCheckState = CheckState.checked;
        const newCheckState = CheckState.indeterminate;

        // act
        const animationClass = getTransitionAnimationClass(oldCheckState, newCheckState);

        // assert
        expect(animationClass).toEqual(ANIM_CHECKED_INDETERMINATE);
    });

    test('it should calculate indeterminate to unchecked transition class', () => {
        // arrange
        const oldCheckState = CheckState.indeterminate;
        const newCheckState = CheckState.checked;

        // act
        const animationClass = getTransitionAnimationClass(oldCheckState, newCheckState);

        // assert
        expect(animationClass).toEqual(ANIM_INDETERMINATE_CHECKED);
    });

    test('it should calculate indeterminate to unchecked transition class', () => {
        // arrange
        const oldCheckState = CheckState.indeterminate;
        const newCheckState = CheckState.unchecked;

        // act
        const animationClass = getTransitionAnimationClass(oldCheckState, newCheckState);

        // assert
        expect(animationClass).toEqual(ANIM_INDETERMINATE_UNCHECKED);
    });
});