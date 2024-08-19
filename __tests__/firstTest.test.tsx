// // __tests__/page.test.tsx
// import { render, screen } from '@testing-library/react';
// import Page from '../app/contact/page'; // Adjust the import path as needed

// test('renders the Primary Button', () => {
//   render(<Page />);

//   // Find the button by its text content
//   const buttonElement = screen.getByText(/Primary Button/i);

//   // Assert that the button is present in the document
//   // const buttonElement = screen.getByText('Click me', { selector: 'button' });

//   // Assert that the button is not null or undefined
//   expect(buttonElement).not.toBeNull();

//   // Assert that the button is truthy
//   expect(buttonElement).toBeTruthy();

//   // Check the tag name to ensure it's a button
//   expect(buttonElement.tagName).toBe('BUTTON');
// });