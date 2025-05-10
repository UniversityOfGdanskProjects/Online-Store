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
        <div className='Registration_Page_Div_Page'>
            <h1 className='register_welcome'>Sing Up</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='register_form'>
                <div className='first_name_div'>
                    <label className='first_name_label'>First Name</label>
                    <input type='text' {...register("first_name")}  className='frist_name_input'/>
                    <p style={{ color: "red" }} className='frist_name_p'>{errors.first_name?.message}</p>
                </div>

                <div className='last_name_div'>
                    <label className='last_name_label'>Last Name</label>
                    <input type='text' {...register("last_name")} className='last_name_input'/>
                    <p style={{ color: "red" }} className='last_name_p'>{errors.last_name?.message}</p>
                </div>

                <div className='email_name_div'>
                    <label className='email_name_label'>Email</label>
                    <input type="email" {...register("email")} className='email_name_input'/>
                    <p style={{ color: "red" }} className='email_name_p'>{errors.email?.message}</p>
                </div >

                <div className='password_name_div'>
                    <label className='password_name_label'>Password</label>
                    <input type="password" {...register("password")} className='password_name_input'/>
                    <p style={{ color: "red" }} className='password_name_p'>{errors.password?.message}</p>
                </div>

                <div className='repet_password_name_div'>
                    <label className='repet_password_name_label'>Repet Password</label>
                    <input type="password" {...register("confirmPassword")} className='repet_password_name_input'/>
                    <p style={{ color: "red" }} className='repet_password_name_p'>{errors.confirmPassword?.message}</p>
                </div>

                <div className='button_layout_registration'>
                    <button type="submit" className='sing_up_button'>Sing Up</button>
                    <Link href='/'>
                        <button className='go_back_button'>Go Back</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default Registration_Page