import { configure, mount } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import toJson from 'enzyme-to-json';

import { Button, ButtonProps } from './Button';

describe('Button', () => {
    configure({adapter: new Adapter()});

    const setUp = (props: ButtonProps, content: string = 'Button') => {
        const wrapper = mount(<Button {...props}>{content}</Button>);
        return toJson(wrapper);
    };

    test('Text Button', () => {
        expect(setUp({})).toMatchSnapshot();
    });

    test('Raised Button', () => {
        expect(setUp({raised: true})).toMatchSnapshot();
    });

    test('Unelevated Button', () => {
        expect(setUp({unelevated: true})).toMatchSnapshot();
    });

    test('Stroked Button', () => {
        expect(setUp({stroked: true})).toMatchSnapshot();
    });

    test('Compact Button', () => {
        expect(setUp({compact: true})).toMatchSnapshot();
    });

    test('Dense Button', () => {
        expect(setUp({dense: true})).toMatchSnapshot();
    });

    test('Icon Button', () => {
        expect(setUp({icon: 'favorite'})).toMatchSnapshot();
    });
});