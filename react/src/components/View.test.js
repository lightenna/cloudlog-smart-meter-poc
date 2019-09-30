import {MockedProvider} from 'react-apollo/test-utils';
import React from 'react';
import {mount, shallow} from '../enzyme_wrapper';
import wait from "waait";
import View from './View';
const debug = true;

describe('View component', () => {

    it('should render an abstract view without error', () => {
        const docs = [];
        const view = <View docs={docs}/>;
        const wrapper = shallow(view);
        if (debug && false) console.log(wrapper.debug());
        wrapper.unmount();
    });

    it('should fire a view change event on type change', () => {
        const view_seq = '0-1-2-3-4';
        const new_type = 'instance';
        const view_changed = jest.fn((view, changed_attrib, new_value) => {
            if (debug && false) console.log('view_changed() called', view, changed_attrib, new_value);
            expect(view.seq).toBe(view_seq);
            expect(new_value).toBe(new_type);
        });
        const docs = [];
        const view = <View seq={view_seq} onViewChange={view_changed} type="list" docs={docs}/>;
        // mount because we need to include the ViewTypeSelector sub-component
        const wrapper = mount(view);
        if (debug && false) console.log(wrapper.debug());
        expect(view_changed.mock.calls.length).toBe(0);
        // simulate type change from 'list' to 'instance' using select
        wrapper.find('select.view-type-selector').simulate('change', { target: { value: new_type } });
        expect(view_changed.mock.calls.length).toBe(1);
        wrapper.unmount();
    });

});
