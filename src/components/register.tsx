import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    name: "",
  })

  const [errors, setErrors] = useState({
    login: "",
    password: "",
    name: "",
  })

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  // Validatsiya qilish funksiyasi
  const validateForm = () => {
    let formIsValid = true
    let newErrors = { login: "", password: "", name: "" }

    // Login bo'sh emasligini tekshirish
    if (!formData.login.trim()) {
      newErrors.login = "Login is required"
      formIsValid = false
    }

    // Parol uzunligini tekshirish (kamida 8 belgi)
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
      formIsValid = false
    }

    // Name bo'sh emasligini tekshirish
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      formIsValid = false
    }

    setErrors(newErrors)
    return formIsValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Agar validatsiya muvaffaqiyatsiz bo'lsa, formani yubormaydi
      return
    }

    try {
      const response = await axios.post('http://195.158.9.124:4109/auth/reg', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.status === 201) {
        const responseText = response.data

        // Muvaffaqiyatli ro'yxatdan o'tish
        if (responseText === 'success') {
          console.log('Registration successful')
        } else if (responseText === 'exist') {
          console.log('User already exists')
        } else {
          console.log('Unexpected response:', responseText)
        }
      } else {
        console.error('Registration failed:', response.status)
      }
      navigate('/login')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="max-w-[448px] w-full mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>

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
            {errors.login && <p className="text-red-500 text-sm">{errors.login}</p>}
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
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="mb-4 w-full">
            <Label htmlFor="name" className="block text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <Button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
            Register
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Aleready your accaunt <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  )
}
