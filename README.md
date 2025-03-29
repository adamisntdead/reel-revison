# Reel Revision

A spaced repetition system for practicing fiddle tunes, built with React and TypeScript. This web application helps musicians learn and maintain their repertoire of traditional tunes through an intelligent practice schedule.

## Features

- **Tune Management**
  - Add, edit, and delete tunes
  - Support for all traditional tune types (reels, jigs, hornpipes, etc.)
  - ABC notation support for storing and displaying tunes
  - Export tunebook as ABC notation

- **Practice System**
  - Spaced repetition algorithm for optimal learning
  - Track practice history and progress
  - Visual feedback on tune mastery
  - Practice schedule recommendations

- **User Interface**
  - Clean, modern Material-UI design
  - Responsive layout for all devices
  - Interactive ABC notation rendering
  - Intuitive navigation

## Tech Stack

- React 18
- TypeScript
- Vite
- Material-UI
- ABCJS for music notation
- React Router for navigation
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/reel-revision.git
   cd reel-revision
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Usage

1. **Adding Tunes**
   - Click the "Add New Tune" button
   - Enter the tune details including title, type, and ABC notation
   - Save the tune to your collection

2. **Practicing**
   - View your practice schedule on the main page
   - Click on a tune to view its details and ABC notation
   - Mark tunes as practiced to update the spaced repetition schedule

3. **Managing Your Collection**
   - Edit tunes by clicking on them and using the edit interface
   - Delete tunes from the detail view
   - Export your entire collection as ABC notation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [ABCJS](https://paulrosen.github.io/abcjs/) for music notation rendering
- [Material-UI](https://mui.com/) for the component library
- The traditional music community for inspiration and support 