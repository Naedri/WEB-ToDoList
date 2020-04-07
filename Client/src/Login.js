import React, { useState } from "react";

const Login = (props) => {

    const [form, setValues] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        username: false,
        password: false
    })

    // eslint-disable-next-line 
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    const validateForm = (errors) => {
        let valid = Object.values(errors).every(
            (val) => val.length === 0
        );
        return valid;
    }

    const printValues = e => {
        e.preventDefault();
        if (validateForm(errors))
            console.log(form.username, form.password);
    };

    const updateField = e => {
        const { name, value } = e.target;
        let err = errors;
        switch (name) {
            case 'username':
                err =
                    !value.trim()
                        ? 'Email is required'
                        : validEmailRegex.test(value) ? '' : 'email is not valid';
                break;
            case 'password':
                err =
                    !value ? "password is required" :
                        value.length < 8
                            ? 'Password must be 8 characters long!'
                            : '';
                break;
            default:
                break;
        }

        setValues({
            ...form,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: err
        })
    };

    return (
        <div className="auth-wrapper mt-2">
            <form onSubmit={printValues}>
                <label htmlFor="username">
                    Username:
                    </label>
                <input
                    value={form.username}
                    id="username"
                    name="username"
                    onChange={updateField}
                />
                {errors.username &&
                    <p className='error'>{errors.username}</p>}
                <br />
                <label htmlFor="password">
                    Password:
                </label>

                <input
                    value={form.password}
                    id="password"
                    name="password"
                    type="password"
                    onChange={updateField}
                />
                {errors.password &&
                    <p className='error'>{errors.password}</p>}
                <br />
                <button>Submit</button>
            </form>
        </div>
    );
}

export default Login;