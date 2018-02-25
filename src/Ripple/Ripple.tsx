import * as cx from 'classnames';
import * as React from 'react';
import { CSSProperties, EventHandler, MouseEvent, TouchEvent, FocusEvent, ReactNode } from 'react';

import { cssClasses, numbers, strings } from './constants';
import { applyPassive, getNormalizedEventCoords } from './util';

const defaultBoundingRect: ClientRect = {
    height: 0,
    width: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
};

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
    ref?: (ref: Element | null) => void;
    className: string;
    style: CSSProperties;
}

interface RippleProps {
    /**
     * If `true` adds base styles for a ripple surface.
     */
    surface?: boolean;
    /**
     * If `true` styles ripple surface using theme's primary colors.
     */
    primary?: boolean;
    /**
     * If `true` styles ripple surface using theme's secondary colors.
     */
    secondary?: boolean;
    /**
     * If `true` lets a ripple grow outside of its bounds, just like on checkboxes or radio buttons.
     */
    unbounded?: boolean;
    /**
     * If `true`, the ripple will be disabled.
     */
    disabled?: boolean;
    /**
     * Returns the ClientRect for the surface.
     * @returns {ClientRect}
     */
    computeBoundingRect?: () => ClientRect;
    render: ((props: RippleComponentProps) => React.ReactNode);
}

class Ripple extends React.Component<RippleProps, RippleState> {
    static defaultProps = {
        surface: true,
        primary: false,
        secondary: false,
        unbounded: false,
        disabled: false,
    };

    private _innerRef: Element | null;
    private _layoutFrame: number;
    private _activationAnimationHasEnded: boolean;
    private _activationHasEnded: boolean;

    // https://github.com/Microsoft/TypeScript/issues/842
    // tslint:disable:no-any
    private _activationTimer: any;
    private _fgDeactivationRemovalTimer: any; // tslint:enable:no-any

    constructor(props: RippleProps) {
        super(props);

        this.state = {
            eventCoords: {x: 0, y: 0},
            frame: {width: 0, height: 0},
            mode: RippleMode.none,
            focused: false
        };

        this._innerRef = null;
        this._layoutFrame = 0;
        this._activationHasEnded = false;
        this._activationAnimationHasEnded = false;
    }

    componentDidMount(): void {
        window.addEventListener('resize', this.handleResize);

        const {width, height} = this.getBoundingClientRect();
        this.setState({frame: {width, height}});
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps: Readonly<RippleProps>, prevState: Readonly<RippleState>) {
        const {mode} = this.state;

        if (mode === RippleMode.activated) {
            clearTimeout(this._activationTimer);
            clearTimeout(this._fgDeactivationRemovalTimer);

            this._activationAnimationHasEnded = false;

            this._activationTimer = setTimeout(() => {
                this._activationAnimationHasEnded = true;
                this.deactivate();
            }, numbers.DEACTIVATION_TIMEOUT_MS);
        } else if (mode === RippleMode.deactivated) {
            clearTimeout(this._fgDeactivationRemovalTimer);
            this._fgDeactivationRemovalTimer = setTimeout(() => {
                this.setState({mode: RippleMode.none});
            }, numbers.FG_DEACTIVATION_MS);
        }
    }

    render() {
        const {unbounded, surface, primary, secondary, computeBoundingRect} = this.props;
        const {frame, mode, focused} = this.state;
        const {height, width} = frame;

        const classNames = cx(cssClasses.ROOT, {
            [cssClasses.UNBOUNDED]: unbounded,
            [cssClasses.FG_ACTIVATION]: mode === RippleMode.activated,
            [cssClasses.FG_DEACTIVATION]: mode === RippleMode.deactivated,
            [cssClasses.BG_FOCUSED]: focused,
            [cssClasses.SURFACE]: surface,
            [cssClasses.SURFACE_PRIMARY]: primary,
            [cssClasses.SURFACE_SECONDARY]: secondary
        });

        const maxDim = Math.max(height, width);
        const maxRadius = unbounded
            ? maxDim
            : Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) + numbers.PADDING;

        const initialSize = maxDim * numbers.INITIAL_ORIGIN_SCALE;
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

        let props: RippleComponentProps = {
            className: classNames,
            style: styles,
            onTouchStart: this.handleActivate,
            onMouseDown: this.handleActivate,
            onTouchEnd: this.handleDeactivate,
            onMouseUp: this.handleDeactivate,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
        };

        if (!computeBoundingRect) {
            props = Object.assign(props, {ref: this.setInnerRef});
        }

        return this.props.render(props);
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
            const {width, height} = this.getBoundingClientRect();
            this.setState({frame: {width, height}});
            this._layoutFrame = 0;
        });
    };

    private handleActivate: EventHandler<React.MouseEvent<{}> | TouchEvent<{}>> = event => {
        if (this.props.disabled || this.state.mode === RippleMode.activated) {
            return;
        }

        this.setState({
            mode: RippleMode.activated,
            eventCoords: getNormalizedEventCoords(event, {
                x: window.pageXOffset,
                y: window.pageYOffset
            }, this.getBoundingClientRect())
        });

        document.documentElement.addEventListener('touchend', this.handleDeactivate, applyPassive());
        document.documentElement.addEventListener('mouseup', this.handleDeactivate, applyPassive());
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
            this.setState({mode: RippleMode.deactivated});

            document.documentElement.removeEventListener('touchend', this.handleDeactivate, applyPassive());
            document.documentElement.removeEventListener('mouseup', this.handleDeactivate, applyPassive());
        }
    };

    private handleFocus = () => this.setState({focused: true});
    private handleBlur = () => this.setState({focused: false});
    private setInnerRef = (ref: Element | null) => this._innerRef = ref;

    private getBoundingClientRect = (): ClientRect => {
        const {computeBoundingRect} = this.props;

        if (computeBoundingRect) {
            return computeBoundingRect();
        } else if (this._innerRef) {
            debugger;
            return this._innerRef.getBoundingClientRect();
        } else {
            return defaultBoundingRect;
        }
    };
}

export { Ripple as default, Ripple, RippleProps, RippleComponentProps, defaultBoundingRect };