import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Ripple } from 'react-spinners-css';
import '../css/styleUser.css' ;
import { forgetPwdUserApi } from '../api.js';


const ForgetPassWord = (props) => {

    const [form, setValues] = useState({
        email: "",
        isSent: '',
    });

    const [errors, setErrors] = useState({
        email: false,
    });

    // eslint-disable-next-line 
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    const validateForm = (errors) => {
        let valid = Object.values(errors).every(
            (val) => val.length === 0
        );
        return valid;
    }

    const endLoading = () => {
        setValues({
            ...form,
            isLoading: '',
        });
    };

    const startLoading = () => {
        setValues({
            ...form,
            isLoading: 'Chargement...',
        });
    };

    let history = useHistory();

    const try_sendEmail = async (e) => {
        e.preventDefault();

        if (validateForm(errors)) {
            try {
                startLoading();
                
                await forgetPwdUserApi(form.email);
                setValues({
                    ...form,
                    isSent: "Si cette adresse correspond à un compte, un email vous a été envoyé !",
                    isLoading: '',
                });

                let url = "/login";
                setTimeout(() => {
                    history.push(url);
                    }, 1000);
            }
            catch (err) {
                setErrors(err.message);
                endLoading();
            }
        }
    };

    const handleChange = e => {
        const { name, value } = e.target; //e objet prend la cible de l evenement donc l objet sur lequel l evenement s est declecnhé (avec un name definie dans le html et une value définie par l'évènements)
        let err = errors;
        switch (name) {
            case 'email':
                err =
                    !value.trim()
                        ? 'Veuillez renseigner une adresse e-mail'
                        : !validEmailRegex.test(value) ? 'L adresse e-mail n est pas valide'
                            : value.length > 48 ? 'Elle doit contenir moins de 50 caractères'
                                : '' ;
                break;
            default:
                break;
        }

        setValues({
            ...form,
            [name]: value,
            isSent: "",
        });
        setErrors({
            ...errors,
            [name]: err,
        });
    };

    const checkSubmitDisabled = () => {
        return (form.isLoading || form.email === '');
    }

    return (
        <div className="container">
            <div className="row justify-content-center py-5 my-5">
                <div className="col-sm col-md-6 col-lg-4">
                    <form onSubmit={try_sendEmail}>
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
                            <button type="submit" disabled={checkSubmitDisabled()} className="btn btn-primary btn-lg btn-block">
                                Récupération
                            </button>
                            {form.isLoading !== '' &&
                                <div className="loadingSpinner" >
                                    <Ripple
                                        color={'#fd7e14'}
                                        size={50}
                                    />
                                </div>
                            }
                            {form.isSent !== '' &&
                                <small
                                    id="isSent"
                                    name="isSent"
                                    className='form-text text-valide'>
                                    {form.isSent}
                                </small>
                            }
                        </div>
                        <div className="form-group">
                            <a href="signup" className="form-text form-text--alt">Mémoire revenue ?<br></br>Connectez-vous !</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}

export default ForgetPassWord;