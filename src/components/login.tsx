import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        login: "",
        password: "",
    });

    const [errors, setErrors] = useState<{ login?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const validateForm = () => {
        const newErrors: { login?: string; password?: string } = {};
        if (!formData.login) {
            newErrors.login = "Login is required";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Validation failed, do not proceed
        }

        setLoading(true);

        try {
            const response = await fetch('http://195.158.9.124:4109/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // JSON formatida javob qaytariladi
            const result = await response.json();

            if (response.ok) {
                // Tokenni olish
                const token = result.token;

                // Tokenni localStorage ga saqlash
                if (token) {
                    localStorage.setItem('authToken', token);
                    console.log('Token saqlandi:', token);
                } else {
                    console.error('Token topilmadi:', result);
                }

                console.log('Login successful:', result);
                navigate("/")
            } else {
                console.error('Login failed:', result);
            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="max-w-[448px] w-full mx-auto p-6 bg-white shadow-md rounded-md">
                <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

                <form className="w-full" onSubmit={handleSubmit}>
                    <div className="mb-4 w-full">
                        <Label htmlFor="login" className="block text-sm font-medium">
                            Login
                        </Label>
                        <Input
                            id="login"
                            type="text"
                            value={formData.login}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border rounded-md"
                        />
                        {errors.login && <p className="text-red-500 text-xs mt-1">{errors.login}</p>}
                    </div>

                    <div className="mb-4 w-full">
                        <Label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border rounded-md"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <Button type="submit" className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white p-2 rounded-md`} disabled={loading}>
                        {loading ? 'Loading...' : 'Login'}
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Create acaunt <a href="/register" className="text-blue-500">Sign in</a>
                </p>
            </div>
        </div>
    );
}
