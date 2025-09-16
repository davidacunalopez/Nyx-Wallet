# Nyx Wallet

A modern cryptocurrency wallet application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 Modern React 18 with Next.js 14
- 💎 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 📱 Responsive design
- 🔗 Wallet connection functionality
- 💰 Balance display
- 📊 Transaction history
- 🎯 Clean and intuitive UI

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── Header.tsx
│   ├── WalletCard.tsx
│   └── TransactionHistory.tsx
├── lib/                   # Utility libraries
├── public/                # Static assets
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── context/               # React context providers
├── utils/                 # Utility functions
└── middleware/            # Next.js middleware
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - Latest React features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.