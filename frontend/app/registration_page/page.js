'use client'
import Link from 'next/link'
import React from "react"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object().shape({
    first_name: yup.string().required("User name is requierd"),
    last_name: yup.string().required("User last name is requierd"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters long").required("Password is required"),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Password confirmation is required.'),
})

const Registration_Page = () => {
    const router = useRouter()

    const{
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = (data) => {
        const {confirmPassword, ...filteredData} = data
        SendJsonToApi(filteredData)
        router.push('/login_page')
    }

    async function SendJsonToApi(data) {
        console.log("Sending data:", data)

        try{
            const response = await fetch('http://localhost:8000/api/user/register', {
                method: "PUT",
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
        } catch (error) {
            console.error('Error sending data to API:', error)
        }
    }

    return (
        <div>
            <h1>Sing Up</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>First Name</label>
                    <input type='text' {...register("first_name")} />
                    <p style={{ color: "red" }}>{errors.first_name?.message}</p>
                </div>

                <div>
                    <label>Last Name</label>
                    <input type='text' {...register("last_name")} />
                    <p style={{ color: "red" }}>{errors.last_name?.message}</p>
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" {...register("email")} />
                    <p style={{ color: "red" }}>{errors.email?.message}</p>
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" {...register("password")} />
                    <p style={{ color: "red" }}>{errors.password?.message}</p>
                </div>

                <div>
                    <label>Repet Password</label>
                    <input type="password" {...register("confirmPassword")} />
                    <p style={{ color: "red" }}>{errors.confirmPassword?.message}</p>
                </div>

                <div>
                    <button type="submit">Sing Up</button>
                    <Link href='/'>
                        <button>Go Back</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default Registration_Page