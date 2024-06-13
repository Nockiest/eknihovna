// import type { NextApiRequest, NextApiResponse } from 'next';
// import { promisify } from 'util';
// import glob from 'glob';
// import path from 'path';

// const globPromise = promisify(glob);

// interface NavButton {
//   URL: string;
//   label: string;
// }

// const generateLabel = (route: string): string => {
//   if (route === '/') return 'Home';
//   return route.slice(1).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<NavButton[] | { error: string }>
// ) {
//   try {
//     // Get all files in the pages directory, excluding certain paths
//     const files = await globPromise('knihovna/app/**/*.tsx', {
//       ignore: [
//         'knihovna/app/_*.tsx',
//         'knihovna/app/api/**/*.tsx',
//         'knihovna/app/**/[id].tsx',
//       ],
//     });

//     // Convert file paths to route paths
//     const routes = files.map((file) => {
//       const relativePath = path.relative('knihovna/app', file);
//       const route = '/' + relativePath.replace(/\\/g, '/').replace(/\/page$/, '');
//       return route === '/index' ? '/' : route;
//     });

//     // Map routes to NavButton objects
//     const navButtons: NavButton[] = routes.map(route => ({
//       URL: route,
//       label: generateLabel(route),
//     }));

//     res.status(200).json(navButtons);
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).json({ error: 'Failed to get routes' });
//   }
// }
