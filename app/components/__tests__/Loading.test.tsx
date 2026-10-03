import { render } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading Component', () => {
    it('renders correctly', () => {
        const { container } = render(<Loading />);
        expect(container.firstChild).toBeInTheDocument();
    });
});