import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t mt-12 py-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} NetworkingPro —{' '}
      <Link to="/privacy-policy" className="underline hover:text-gray-700">
        Politique de confidentialité
      </Link>
    </footer>
  );
}
