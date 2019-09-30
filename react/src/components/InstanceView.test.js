import React from 'react';
import {mount, shallow} from '../enzyme_wrapper';
import InstanceView from './InstanceView';
import ViewTypeSelector from "./ViewTypeSelector";
import wait from "waait";

const debug = true;

describe('InstanceView component', () => {

    it('should render a component without error', () => {
        const buttons = [
            <ViewTypeSelector key={0} type={'instance'}/>
        ];
        const inst = <InstanceView seq={0} docs={[]} sharedButtons={buttons}/>;
        // shallow doesn't need a full wrapped component
        const wrapper = shallow(inst);
        wrapper.unmount();
    });

    it('should update type on typeChange', () => {
        const docs = [];
        const new_type = 'list';
        let last_type = 'instance';
        const handleTypeChange = jest.fn((type) => {
            if (debug && false) console.log('handleTypeChange to ', type);
            last_type = type;
        });
        const buttons = [ <ViewTypeSelector key={0} type={'instance'} onChange={handleTypeChange}/> ];
        const inst = <InstanceView seq={0} docs={docs} sharedButtons={buttons}/>;
        // render component
        const wrapper = mount(inst);
        // look for static marker in HTML
        expect(wrapper.find('.content-scrollable')).toHaveLength(1);
        // change selector
        wrapper.find('select option[value="' + new_type + '"]').simulate('change');
        // wrapper = wrapper.update();
        expect(wrapper.find('InstanceViewButtons').prop('nesting')).toEqual('firstreg');
        // check handler got called
        expect(handleTypeChange.mock.calls.length).toBe(1);
        // check type got updated
        expect(last_type).toBe(new_type);
        wrapper.unmount();
    });

    it('should update nesting on nestingChange', () => {
        const docs = [];
        const new_nesting = 'firstserv';
        const buttons = [ <ViewTypeSelector key={0} type={'instance'}/> ];
        const inst = <InstanceView seq={0} docs={docs} sharedButtons={buttons}/>;
        // render component
        const wrapper = mount(inst);
        // check initial nesting
        expect(wrapper.find('InstanceViewButtons').prop('nesting')).toEqual('firstreg');
        // change selector
        wrapper.find('select option[value="' + new_nesting + '"]').simulate('change');
        // wrapper = wrapper.update();
        expect(wrapper.find('InstanceViewButtons').prop('nesting')).toEqual(new_nesting);
        wrapper.unmount();
    });

});
