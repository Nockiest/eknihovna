import ColorCirclesComprehensive from "@/components/general/styling/ColorCirclesComprehensive";
import { render, screen } from '@testing-library/react'

describe('ColorCirclesComprehensive', () => {

    // Renders all color circles with correct labels and shades
    it('should render all color circles with correct labels and shades', () => {
      const { getByText, getAllByRole } = render(<ColorCirclesComprehensive/>);

      const labels = ['Primary', 'Secondary', 'Background', 'Accent', 'Text'];
      labels.forEach(label => {
        expect(getByText(label)).toBeInTheDocument(); // Updated matcher
      });

      const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
      const circles = getAllByRole('presentation');
      expect(circles).toHaveLength(labels.length * shades.length);
    });

    // Handles an empty tailwindColors array gracefully
    it('should handle an empty tailwindColors array gracefully', () => {
      const originalColors = ColorCirclesComprehensive.__get__('tailwindColors');
      ColorCirclesComprehensive.__set__('tailwindColors', []);

      const { queryByRole } = render(<ColorCirclesComprehensive />);

      const circles = queryByRole('presentation');
      expect(circles).toBeNull();

      ColorCirclesComprehensive.__set__('tailwindColors', originalColors);
    });

    // Verifies that each color circle is rendered with the correct shade value.
    it('should render all color circles with correct shade values', () => {
        const { getByText, getAllByRole } = render(<ColorCirclesComprehensive />);

        const labels = ['Primary', 'Secondary', 'Background', 'Accent', 'Text'];
        labels.forEach(label => {
            expect(getByText(label)).toBeInTheDocument(); // Updated matcher
        });

        const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
        const circles = getAllByRole('presentation');
        expect(circles).toHaveLength(labels.length * shades.length);
    });
});