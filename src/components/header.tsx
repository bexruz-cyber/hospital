import { useNavigate } from "react-router-dom"

export default function Top_navbar() {
  const navigate = useNavigate()
  return (
    <header className="pb-5 pt-5">
      <ul className="flex items-center gap-5">
        <li onClick={() => navigate("/")} className="text-xl font-semibold cursor-pointer hover:opacity-60 transition-all duration-300">Home</li>
        <li onClick={() => navigate("/department")} className="text-xl font-semibold cursor-pointer hover:opacity-60 transition-all duration-300">Department</li>
        <li onClick={() => navigate("/rooms")} className="text-xl font-semibold cursor-pointer hover:opacity-60 transition-all duration-300">Rooms</li>
        <li onClick={() => navigate("/spec")} className="text-xl font-semibold cursor-pointer hover:opacity-60 transition-all duration-300">Spec</li>
        <li onClick={() => navigate("/doctor")} className="text-xl font-semibold cursor-pointer hover:opacity-60 transition-all duration-300">Doctor</li>
        <li onClick={() => navigate("/position")} className="text-xl font-semibold cursor-pointer hover:opacity-60 transition-all duration-300">Position</li>
      </ul>
    </header>
  )
}
