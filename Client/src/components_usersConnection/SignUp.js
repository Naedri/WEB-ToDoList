import React, { useState } from "react";
import { Ripple } from 'react-spinners-css';

import '../css/styleUser.css' ;
import { isFreeUserApi } from '../api.js';

const SignUp = (props) => {

    const [form, setValues] = useState({
        email: "",
        password: "",
        password2: "",
        isLoading: "",
        isCreate: "",
    });

    const [errors, setErrors] = useState({
        email: false,
        password: false,
        password2: false,
    });

    // eslint-disable-next-line
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    const validateForm = (errors) => {
        let valid = Object.values(errors).every(
            (val) => val.length === 0
        );
        return valid;
    }

    const try_signup = async (e) =>  {
        e.preventDefault();

        if (validateForm(errors)){
            try {
                setValues({
                    ...form,
                    ['isLoading']: 'Chargement...',
                    ['isCreate'] : '',
                });

                let status = await isFreeUserApi(form.email) ;
                if (status ==='true'){
                    console.log("il faut utiliser createUserApi");
                    setValues({
                        ...form,
                        ['isCreate'] : 'Un email de confirmation vous a été envoyé',
                        ['isLoading']: '',
                    });
                } else {
                    console.log("il faut choisir un autre email");
                    setValues({
                        ...form,
                        ['isLoading']: '',
                    });
                    setErrors({
                        ...errors,
                        ['email']: 'Cette adresse e-mail est déjà utilisée',
                    });
                }
            }
            catch (err) {
                console.log(err);
                setErrors(err.message);
            }
        }
    };


    const handleChange = e => {
        const { name, value } = e.target;
        let err = errors;
        switch (name) {
            case 'email':
                err =
                    !value.trim() ? 'Veuillez renseigner une adresse e-mail'
                        : !validEmailRegex.test(value) ? 'L adresse e-mail n est pas valide'
                            : value.length > 48 ? 'Elle doit contenir moins de 50 caractères'
                                : '' ;
                break;
            case 'password':
                err =
                    !value ? "Veuillez renseigner un mot de passe"
                        : value.length < 8 ? 'Il doit contenir au moins 8 caractères'
                            : value.length > 15 ? 'Il doit contenir moins de 16 caractères'
                                : '';
                break;
            case 'password2':
                err =
                    value===form.password ? ''
                        : 'Les mots de passe ne correspondent pas';
                break;
            default:
                break;
        }
        if (name=='email'||name=='password'||name=='password2'){
            setValues({
                ...form,
                [name]: value,
                ['isCreate'] : '',
                ['isLoading']: '',
            });
            setErrors({
                ...errors,
                [name]: err
            });
        }
    };

    return (
        <div className="container">
            <div className="row">

                <div className="auth-wrapper mt-2">

                    <form onSubmit={try_signup}>

                        <div className="form-group">
                            <label htmlFor="email">
                                Adresse e-mail
                                </label>
                            <input
                                type="mail"
                                className="form-control"
                                placeholder="mail@provider"

                                value={form.email}
                                id="email"
                                name="email"
                                onChange={handleChange}
                            />
                            {errors.email &&
                                <small
                                    id="mailNull"
                                    className='form-text text-error'>
                                        {errors.email}
                                </small>
                            }

                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                Mot de passe
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"

                                value={form.password}
                                id="password"
                                name="password"
                                onChange={handleChange}
                            />
                            {errors.password &&
                                <small
                                    id="passwordNull"
                                    className='form-text text-error'>
                                        {errors.password}
                                </small>
                            }
                        </div>


                        <div className="form-group">
                            <label htmlFor="password2">
                                Répétez le mot de passe
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"

                                value={form.password2}
                                id="password2"
                                name="password2"
                                onChange={handleChange}
                            />
                            {errors.password2 &&
                                <small
                                    id="passwordDifferent"
                                    className='form-text text-error'>
                                        {errors.password2}
                                </small>
                            }
                        </div>

                        <div className="form-group">
                          <button type="submit"
                              disabled={ !form.isLoading && (form.email==="" || form.password==="" || form.password2==="" || form.password!==form.password2) }
                              className="btn btn-primary btn-lg btn-block">
                                  Inscription
                          </button>

                          {form.isLoading!=='' &&
                            <div className="loadingSpinner" >
                                    <Ripple
                                      color={'#fd7e14'}
                                      size={50}
                                    />
                            </div>
                          }
                          
                          {form.isCreate!=='' &&
                              <small
                                  id="isCreate"
                                  name="isCreate"
                                  className='form-text text-valide'>
                                      {form.isCreate}
                              </small>
                          }
                        </div>

                        <div className="form-group">
                            <a href="login" className="form-text form-text--alt">
                                Vous avez déjà un compte ?<br></br>Connectez-vous !</a>
                        </div>

                    </form>
                </div>

            </div>
        </div>

    );
}

export default SignUp;