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
            SendJsonToApiUser(filteredData, role)
            router.push('/')
        } else if (role === "admin") {
            SendJsonToApiAdmin(filteredData, role)
            router.push('/order_menagment')
        }
    }

    async function SendJsonToApiUser(data, role) {
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
                console.log("Zapisuję email do sessionStorage:", data.email);
                sessionStorage.setItem('email', data.email)
                sessionStorage.setItem('role', role)
                window.dispatchEvent(new Event("storage"));
            } else {
                console.log(result)
                console.log("Błąd rejestracji:", result.message)
            }
        } catch (error) {
            console.error('Error sending data to API:', error)
        }
    }

    async function SendJsonToApiAdmin(data, role) {
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
                console.log("Zapisuję email do sessionStorage:", data.email);
                sessionStorage.setItem('email', data.email)
                sessionStorage.setItem('role', role)
                window.dispatchEvent(new Event("storage"));
            } else {
                console.log(result)
                console.log("Błąd rejestracji:", result.message)
            }
        } catch (error) {
            console.error('Error sending data to API:', error)
        }
    }
    return (
        <div className='Login_Page_Div_Page'>
            <h1 className='login_welcome'>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="login_form">
                <div className="chose_role_div">
                    <label className="chose_role_label">Chose Role</label>
                    <div className="chose_role_label_div">
                      <label className="admin_role_label">
                        <input type="radio" value="admin" {...register("role", { required: "Role is required" })}  className="admin_role_input"/>
                        Admin
                      </label>
                      <label className="user_role_label">
                        <input type="radio" value="user" {...register("role", { required: "Role is required" })} className="user_role_input" />
                        User
                      </label>
                    </div>
                    <p className='chose_role_p' style={{ color: "red" }}>{errors.role?.message}</p>
                </div>
                <div className="email_div">
                    <label className="email_label">Email</label>
                    <input type="email" {...register("email")} className="email_input"/>
                    <p className='email_p' style={{ color: "red" }}>{errors.email?.message}</p>
                </div>

                <div className="password_div">
                    <label className="password_label">Password</label>
                    <input type="password" {...register("password")} className="password_input"/>
                    <p style={{ color: "red" }} className="password_p">{errors.password?.message}</p>
                </div>

                <div className="button_layout_login">
                    <button type="submit" className="login_button">Login</button>
                    <button type="button" onClick={() => router.push('/')} className="go_back_button">Go Back</button>
                </div>
            </form>
        </div>
    )
}

export default Login_Page