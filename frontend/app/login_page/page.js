'use client'
import React from "react"
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import* as yup from "yup"

const schema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().required("Password is required"),
    role: yup.string()
        .oneOf(["admin", "user"], "You must select a role.")
        .required("Role is required.")
})

const Login_Page = () => {
    const{
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const router = useRouter()

    const onSubmit = (data) => {
        const {role, ...filteredData} = data
        if (role === "user"){
            SendJsonToApiUser(filteredData)
            router.push('/')
        } else if (role === "admin") {
            SendJsonToApiAdmin(filteredData)
            router.push('/admin_home_page')
        }
    }

    async function SendJsonToApiUser(data) {
        console.log("Sending data:", data)

        try{
            const response = await fetch('http://localhost:8000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            console.log(result)
            if (result.message === 'Login successful'){
                sessionStorage.setItem('email', data.email)
            } else {
                console.log(result)
                console.log("Błąd rejestracji:", result.message)
            }
        } catch (error) {
            console.error('Error sending data to API:', error)
        }
    }

    async function SendJsonToApiAdmin(data) {
        console.log("Sending data:", data)

        try{
            const response = await fetch('http://localhost:8000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            console.log(result)
            if (result.message === 'Login successful'){
                sessionStorage.setItem('email', data.email)
            } else {
                console.log(result)
                console.log("Błąd rejestracji:", result.message)
            }
        } catch (error) {
            console.error('Error sending data to API:', error)
        }
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Chose Role</label>
                    <div>
                      <label>
                        <input type="radio" value="admin" {...register("role", { required: "Role is required" })} />
                        Admin
                      </label>
                      <label>
                        <input type="radio" value="user" {...register("role", { required: "Role is required" })} />
                        User
                      </label>
                    </div>
                    <p className='p_login' style={{ color: "red" }}>{errors.role?.message}</p>
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" {...register("email")} />
                    <p className='p_login' style={{ color: "red" }}>{errors.email?.message}</p>
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" {...register("password")} />
                    <p style={{ color: "red" }}>{errors.password?.message}</p>
                </div>

                <div>
                    <button type="submit">Login</button>
                    <button type="button" onClick={() => router.push('/')}>Go Back</button>
                </div>
            </form>
        </div>
    )
}

export default Login_Page