import React, { useState } from "react";


const ForgetPassWord = (props) => {

    const [form, setValues] = useState({
        username: ""
    });

    const [errors, setErrors] = useState({
        username: false,
    });

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
            console.log(form.username);
        
    };

    //function sendEmail

    const handleChange = e => {
        const { name, value } = e.target; //e objet prend la cible de l evenement donc l objet sur lequel l evenement s est declecnhé (avec un name definie dans le html et une value définie par l'évènements)
        let err = errors;
        switch (name) {
            case 'username':
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
            [name]: value //name est soit password, soit username (name) et l un des deux prendra comme valeur (value) err
        });
        setErrors({
            ...errors,
            [name]: err //name est soit password, soit username (name) et l un des deux prendra comme valeur (value) err
        });
    };

    return (
        <div className="container">
            <div className="row"> 

                <div className="auth-wrapper mt-2">

                    <form onSubmit={printValues}>

                        <div className="form-group">
                            <label htmlFor="username"> 
                                Adresse e-mail
                                </label>
                            <input
                                type="mail"
                                className="form-control"
                                placeholder="mail@provider"
                                
                                value={form.username}
                                id="username"
                                name="username"
                                onChange={handleChange}
                            />
                            {errors.username &&
                                <small 
                                    id="mailNull"
                                    className='form-text text-error'>
                                        {errors.username}
                                </small>
                            }
                        </div>

                        <button type="submit" disabled={form.username===""} className="btn btn-primary btn-lg btn-block">
                            Récupération
                        </button>

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