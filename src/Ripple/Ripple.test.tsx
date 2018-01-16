import { configure, mount } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import toJson from 'enzyme-to-json';

import { Ripple, RippleProps } from './Ripple';

describe('Button', () => {
    configure({adapter: new Adapter()});

    const setUp = (props: Partial<RippleProps>, content: string = 'Ripple') => {
        const wrapper = mount(
            <Ripple
                {...props}
                render={({innerRef, ...rest}) =>
                    (<div {...rest} ref={innerRef}>{content}</div>)}
            />);
        return toJson(wrapper);
    };

    test('Bounded', () => {
        expect(setUp({})).toMatchSnapshot();
    });

    test('Unbounded', () => {
        expect(setUp({unbounded: true})).toMatchSnapshot();
    });

    test('Primary', () => {
        expect(setUp({primary: true})).toMatchSnapshot();
    });

    test('Secondary', () => {
        expect(setUp({secondary: true})).toMatchSnapshot();
    });
});