import './globals.css';

export const metadata = {
  title: 'Carbon + Water Stress Explorer',
  description: 'Interactive map of data center sustainability costs across the US — combining grid carbon intensity, carbon pricing, and water scarcity risk.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
