import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">StageProspect</h1>
      <div className="space-x-4">
        <Link to="/">Accueil</Link>
        <Link to="/login">Connexion</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}