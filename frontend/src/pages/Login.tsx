import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/redux-hooks";
import { login } from "../slices/authSlice";
import Button, { SubmitButton } from "./components/Button";
import { useNavigate } from "react-router-dom";
import LogInIcon from "../icons/login.png";
import { Email, Paasswort } from "./components/Inputs";
import { LabelOverInput } from "./components/Label";
import DialogAlert from "../Pop-Up-Window/alert";
import { AxiosError } from "axios";


function Login() {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [titleAlertWindow, setTitleAlertWindow] = useState("");
    const [textAlertWindow, setTextAlertWindow] = useState("");
    const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        //alert("Login button clicked" + email + " " + password);
        if (email && password) {
            try {
                const resultAction = await dispatch(login({ email, password })).unwrap();
                navigate('/');
            } catch (e: any) {
                console.error("Login fehlgeschlagen:", e);

                let errorTitle = "Login fehlgeschlagen";
                let errorMessage = "Ein unbekannter Fehler ist aufgetreten.";

                // Da rejectWithValue jetzt die Backend-Daten direkt weitergibt,
                // sollte `e` direkt das Objekt `{ message: "..." }` sein.
                if (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') {
                    errorMessage = e.message;
                } else {
                    errorMessage = "Ein unerwarteter Fehler ist aufgetreten (unbekanntes Format).";
                }

                setTitleAlertWindow(errorTitle);
                setTextAlertWindow(errorMessage);
                setIsOpenAlertDialog(true); 
            }
        } else {
            setTitleAlertWindow("Login fehlgeschlagen");
            setTextAlertWindow("Bitte fülle alle Felder aus.");
            setIsOpenAlertDialog(true);
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
                    <form onSubmit={handleLogin} className="space-y-6">
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
                            <SubmitButton>Sign in</SubmitButton>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Do you not yet have an account?{' '}
                        <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Please register.
                        </a>
                    </p>
                </div>
            </div>
            <DialogAlert open={isOpenAlertDialog} isOpen={() =>setIsOpenAlertDialog(false)} header={titleAlertWindow}  content={textAlertWindow}/>
        </>

    )
}
export default Login;