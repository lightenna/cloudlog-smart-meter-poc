import 'jest-canvas-mock';
import { configure } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

// work around Jest mount() being unable to cope with lazy-loading or HTML Canvas

// set up Enzyme's react adapter
configure({ adapter: new EnzymeAdapter() });
