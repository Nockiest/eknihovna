import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ExcelSheetUpdater from '../components/upload/ExcelSheetUpdater.tsx';
import Page from '../app/page';

describe('Page', () => {
    // it('renders a heading', async () => {
    //     render(<Page />);

    //     // Use findBy to wait for the heading to appear
    //     const div = await screen.findByRole('div' );
    //     expect(div).toBeInTheDocument();
    // });

    it('renders ExcelSheetUpdater', async () => {
        render(<ExcelSheetUpdater />);

        // Assuming ExcelSheetUpdater renders some text or element
        const updaterElement = await screen.findByText('Some text from ExcelSheetUpdater'); // Replace with actual text or selector
        expect(updaterElement).toBeInTheDocument();
    });
});
