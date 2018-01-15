import * as cx from 'classnames';
import * as React from 'react';
import { CSSProperties, EventHandler, MouseEvent, TouchEvent, FocusEvent } from 'react';

import { cssClasses, numbers, strings } from './constants';
import { getNormalizedEventCoords, supportsCssVariables } from './util';

enum RippleMode {
    none, activated, deactivated
}

interface RippleState {
    eventCoords: {
        x: number,
        y: number,
    };
    frame: {
        width: number;
        height: number;
    };
    mode: RippleMode;
    focused: boolean;
}

interface RippleComponentProps {
    onTouchStart: EventHandler<TouchEvent<{}>>;
    onTouchEnd: EventHandler<TouchEvent<{}>>;
    onMouseDown: EventHandler<MouseEvent<{}>>;
    onMouseUp: EventHandler<MouseEvent<{}>>;
    onBlur: EventHandler<FocusEvent<{}>>;
    onFocus: EventHandler<FocusEvent<{}>>;
    innerRef: (ref: Element | null) => void;
    className: string;
    style: CSSProperties;
}

interface RippleProps {
    unbounded?: boolean;
    disabled?: boolean;
    render: ((props: RippleComponentProps) => React.ReactNode);
}

class Ripple extends React.Component<RippleProps, RippleState> {
    state = {
        eventCoords: {x: 0, y: 0},
        frame: {width: 0, height: 0},
        mode: RippleMode.none,
        focused: false
    };

    private _innerRef: Element | null;
    private _layoutFrame: number;
    private _activationTimer: number;
    private _fgDeactivationRemovalTimer: number;
    private _activationAnimationHasEnded: boolean;
    private _activationHasEnded: boolean;

    componentDidMount(): void {
        if (!supportsCssVariables() || !this._innerRef) {
            return;
        }

        window.addEventListener('resize', this.handleResize);

        const {width, height} = this._innerRef.getBoundingClientRect();
        this.setState({frame: {width, height}});
    }

    componentWillUnmount(): void {
        if (!supportsCssVariables() || !this._innerRef) {
            return;
        }

        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps: Readonly<RippleProps>, prevState: Readonly<RippleState>) {
        const {mode} = this.state;

        if (mode === RippleMode.activated) {
            clearTimeout(this._activationTimer);
            clearTimeout(this._fgDeactivationRemovalTimer);

            this._activationAnimationHasEnded = false;

            this._activationTimer = window.setTimeout(() => {
                this._activationAnimationHasEnded = true;
                this.deactivate();
            }, numbers.DEACTIVATION_TIMEOUT_MS);
        } else if (mode === RippleMode.deactivated) {
            clearTimeout(this._fgDeactivationRemovalTimer);
            this._fgDeactivationRemovalTimer = window.setTimeout(() => {
                this.setState({mode: RippleMode.none});
            }, numbers.FG_DEACTIVATION_MS);
        }
    }

    render() {
        const {unbounded} = this.props;
        const {frame, mode, focused} = this.state;
        const {height, width} = frame;

        const classNames = cx(cssClasses.ROOT, {
            [cssClasses.UNBOUNDED]: unbounded,
            [cssClasses.BG_ACTIVE_FILL]: mode === RippleMode.activated,
            [cssClasses.FG_ACTIVATION]: mode === RippleMode.activated,
            [cssClasses.FG_DEACTIVATION]: mode === RippleMode.deactivated,
            [cssClasses.BG_FOCUSED]: focused
        });

        const maxDim = Math.max(height, width);
        const surfaceDiameter = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        const initialSize = maxDim * numbers.INITIAL_ORIGIN_SCALE;
        const maxRadius = surfaceDiameter + numbers.PADDING;
        const fgScale = maxRadius / initialSize;
        const unboundedCoords = unbounded ? {
            left: Math.round((width / 2) - (initialSize / 2)),
            top: Math.round((height / 2) - (initialSize / 2)),
        } : {left: 0, top: 0};

        let styles = {
            [strings.VAR_FG_SIZE]: `${initialSize}px`,
            [strings.VAR_FG_SCALE]: `${fgScale}`,
            [strings.VAR_LEFT]: `${unboundedCoords.left}px`,
            [strings.VAR_TOP]: `${unboundedCoords.top}px`
        };

        if (mode === RippleMode.activated || mode === RippleMode.deactivated) {
            let translateStart = '';
            let translateEnd = '';

            if (!unbounded) {
                const {startPoint, endPoint} = this.getFgTranslationCoordinates(initialSize);
                translateStart = `${startPoint.x}px, ${startPoint.y}px`;
                translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
            }

            styles = Object.assign(styles, {
                [strings.VAR_FG_TRANSLATE_START]: translateStart,
                [strings.VAR_FG_TRANSLATE_END]: translateEnd
            });
        }

        return (
            <>{this.props.render({
                className: classNames,
                style: styles,
                onTouchStart: this.handleActivate,
                onMouseDown: this.handleActivate,
                onTouchEnd: this.handleDeactivate,
                onMouseUp: this.handleDeactivate,
                onFocus: this.handleFocus,
                onBlur: this.handleBlur,
                innerRef: this.setInnerRef,
            })}</>
        );
    }

    private getFgTranslationCoordinates = (initialSize: number) => {
        const {eventCoords, frame} = this.state;

        const startPoint = {
            x: eventCoords.x - (initialSize / 2),
            y: eventCoords.y - (initialSize / 2)
        };
        const endPoint = {
            x: (frame.width / 2) - (initialSize / 2),
            y: (frame.height / 2) - (initialSize / 2),
        };

        return {startPoint, endPoint};
    };

    private handleResize = () => {
        if (this._layoutFrame) {
            cancelAnimationFrame(this._layoutFrame);
        }

        this._layoutFrame = requestAnimationFrame(() => {
            if (!this._innerRef) {
                return;
            }

            const {width, height} = this._innerRef.getBoundingClientRect();
            this.setState({frame: {width, height}});
            this._layoutFrame = 0;
        });
    };

    private handleActivate: EventHandler<React.MouseEvent<{}> | TouchEvent<{}>> = event => {
        if (this.props.disabled || this.state.mode === RippleMode.activated || !this._innerRef) {
            return;
        }

        this.setState({
            mode: RippleMode.activated,
            eventCoords: getNormalizedEventCoords(event, {
                x: window.pageXOffset,
                y: window.pageYOffset
            }, this._innerRef.getBoundingClientRect())
        });

        this._activationHasEnded = false;
    };

    private handleDeactivate = () => {
        if (this.state.mode === RippleMode.activated) {
            this._activationHasEnded = true;
            this.deactivate();
        }
    };

    private deactivate = () => {
        const {
            _activationAnimationHasEnded: activationAnimationHasEnded,
            _activationHasEnded: activationHasEnded
        } = this;

        if (activationAnimationHasEnded && activationHasEnded) {
            this._activationAnimationHasEnded = false;
            this.setState({mode: RippleMode.deactivated, focused: false});
        }
    };

    private handleFocus = () => this.setState({focused: true});
    private handleBlur = () => this.setState({focused: false});
    private setInnerRef = (ref: Element | null) => this._innerRef = ref;
}

export { Ripple, RippleProps, RippleComponentProps };