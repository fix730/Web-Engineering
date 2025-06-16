import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/redux-hooks";
import { login } from "../slices/authSlice";
import Button, { SubmitButton } from "./components/Button";
import { useNavigate } from "react-router-dom";
import LogInIcon from "../icons/login.png";
import { Email, Paasswort } from "./components/Inputs";
import { LabelOverInput } from "./components/Label";


function Login() {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("1");
    const [password, setPassword] = useState("test123");

    const navigate = useNavigate();

    const handleLogin = async () => {
        // This is only a basic validation of inputs. Improve this as needed.
        if (email && password) {
            try {
                await dispatch(
                    login({
                        email,
                        password,
                    })
                ).unwrap();
            } catch (e) {
                console.error(e);
            }
        } else {
            // Show an error message.
        }
    };
    const handleChnceEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handleChncePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };


    const navigateToRegister = () => {
        navigate("/register");
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img alt="Login Logo" src={LogInIcon} className="mx-auto h-10 w-auto" />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" method="POST" className="space-y-6">
                        <div>
                            <LabelOverInput>E-Mail</LabelOverInput>
                            <div className="mt-2">
                                <Email email={email} handleChnceEmail={handleChnceEmail} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <LabelOverInput>Passwort</LabelOverInput>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <Paasswort password={password} handleChncePassword={handleChncePassword} autoComplete="currentPassword" />
                            </div>
                        </div>

                        <div>
                            <SubmitButton onClick={handleLogin}>Sign in</SubmitButton>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Hast du schon ein Benutzerkonto?{' '}
                        <a onClick={navigateToRegister} className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Registrie dich
                        </a>
                    </p>
                </div>
            </div>
        </>

    )
}
export default Login;