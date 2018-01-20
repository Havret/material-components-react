import * as cx from 'classnames';
import * as React from 'react';
import { HTMLProps, ChangeEventHandler } from 'react';

import { ObjectOmit } from '../utils';
import {
    ANIM_END_LATCH_MS,
    BACKGROUND,
    CHECKMARK,
    CHECKMARK_PATH,
    DISABLED,
    MIXEDMARK,
    NATIVE_CONTROL,
    ROOT,
    UPGRADED,
    CheckState
} from './constants';
import { determineCheckState, getTransitionAnimationClass } from './util';

interface CheckboxProps extends ObjectOmit<HTMLProps<HTMLInputElement>, 'type'> {
    /**
     * Addition CSS classes that will be added to the root element.
     */
    className?: string;
    /**
     * If `true`, the checkbox is checked.
     */
    checked?: boolean;
    /**
     * If `true`, the checkbox is indeterminate.
     */
    indeterminate?: boolean;
    /**
     * If `true`, the checkbox will be disabled.
     */
    disabled?: boolean;
    /**
     *    Callback fired when the state is changed.
     */
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

interface CheckboxState {
    checkState: CheckState;
    transitionAnimationClass: string;
}

class Checkbox extends React.Component<CheckboxProps, CheckboxState> {
    static defaultProps = {
        checked: false,
        indeterminate: false,
        disabled: false,
    };

    // https://github.com/Microsoft/TypeScript/issues/842
    // tslint:disable-next-line:no-any
    private _animEndLatchTimer: any = 0;

    constructor(props: CheckboxProps) {
        super(props);

        this.state = {
            checkState: determineCheckState(props),
            transitionAnimationClass: ''
        };
    }

    componentWillReceiveProps(nextProps: Readonly<CheckboxProps>): void {
        const checkState = determineCheckState(nextProps);
        const oldCheckState = this.state.checkState;

        if (checkState === this.state.checkState) {
            return;
        }

        const transitionAnimationClass = getTransitionAnimationClass(oldCheckState, checkState);

        this.setState({checkState, transitionAnimationClass});
    }

    render() {
        const {
            className,
            disabled,
            indeterminate,  // Filter out properties which should not
            checked,        // be passed to native input element
            ...rest
        } = this.props;
        const {transitionAnimationClass, checkState} = this.state;

        const classNames = cx(ROOT, UPGRADED, transitionAnimationClass, {
            [DISABLED]: disabled
        }, className);

        const onAnimationEnd = transitionAnimationClass.length > 0
            ? this.handleOnAnimationEnd
            : undefined;

        return (
            <div
                className={classNames}
                onAnimationEnd={onAnimationEnd}
            >
                <input
                    {...rest}
                    type="checkbox"
                    className={NATIVE_CONTROL}
                    disabled={disabled}
                    checked={checkState === CheckState.checked}
                    ref={x => x ? x.indeterminate = checkState === CheckState.indeterminate : undefined}
                />
                <div className={BACKGROUND}>
                    <svg className={CHECKMARK} viewBox="0 0 24 24">
                        <path
                            className={CHECKMARK_PATH}
                            fill="none"
                            stroke="white"
                            d="M1.73,12.91 8.1,19.28 22.79,4.59"
                        />
                    </svg>
                    <div className={MIXEDMARK}/>
                </div>
            </div>
        );
    }

    private handleOnAnimationEnd: React.AnimationEventHandler<HTMLDivElement> = () => {
        clearTimeout(this._animEndLatchTimer);
        this._animEndLatchTimer = setTimeout(() => {
            this.setState({transitionAnimationClass: ''});
        }, ANIM_END_LATCH_MS);
    };
}

export { Checkbox as default, Checkbox, CheckboxProps };