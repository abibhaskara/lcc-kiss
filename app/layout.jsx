import './globals.css';

export const metadata = {
  title: 'Live Score System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
