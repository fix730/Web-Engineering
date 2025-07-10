
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
  useEffect(() => {
    document.title = "Login - FindDHBW";
  }, []);

  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [titleAlertWindow, setTitleAlertWindow] = useState("");
  const [textAlertWindow, setTextAlertWindow] = useState("");
  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // --- Funktion zur Handhabung des Login-Vorgangs ---
  // Versucht den Benutzer mit den eingegebenen Daten anzumelden.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();



    if (email && password) {
      setIsLoading(true); // Ladeanzeige starten

      try {
        const resultAction = await dispatch(login({ email, password })).unwrap();
        navigate('/');
      } catch (e: any) {
        console.error("Login fehlgeschlagen:", e);

        let errorTitle = "Login fehlgeschlagen";
        let errorMessage = "Ein unbekannter Fehler ist aufgetreten.";

        if (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') {
          errorMessage = e.message;
        } else {
          errorMessage = "Ein unerwarteter Fehler ist aufgetreten (unbekanntes Format).";
        }

        setTitleAlertWindow(errorTitle);
        setTextAlertWindow(errorMessage);
        setIsOpenAlertDialog(true);
      } finally {
        setIsLoading(false); // Ladeanzeige beenden
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

  // --- Funktion zur Navigation zur Registrierungsseite ---
  const navigateToRegister = () => {
    navigate("/register");
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="spinner"></div>
      </div>
    );
  }


  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg-login1.jpg')" }}>

      <div className="absolute top-20 flex items-center justify-center w-full">
        <div className="flex items-center space-x-4">
          <h1 className="text-5xl mb-40 font-bold drop-shadow-lg">
            <span className="text-white">Find</span>
            <span className="text-red-600">DHBW</span>
          </h1>
          <img src="/finddhbwlogob.jpg" alt="DHBW Logo" className="h-16 w-auto mb-40" />
        </div>
      </div>
      <div className="bg-white bg-opacity-80 mt-20 rounded-xl shadow-lg p-10 w-full max-w-md backdrop-blur-md">
        <div className="text-center mb-6">
          <img src={LogInIcon} alt="Login Icon" className="mx-auto h-12 w-12" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <LabelOverInput>Email</LabelOverInput>
            <Email email={email} handleChnceEmail={handleChnceEmail} />
          </div>

          <div>
            <LabelOverInput>Passwort</LabelOverInput>
            <Paasswort password={password} handleChncePassword={handleChncePassword} autoComplete="currentPassword" />
            {/*
            <div className="text-right text-sm mt-1">
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Passwort vergessen?
              </a>
            </div>
            */ }
          </div>

          <div>
            <SubmitButton disabled={isLoading}>
              {isLoading ? "Signing in..." : "In ihr Konto einloggen"}
            </SubmitButton>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Noch kein Konto?{" "}
          <a onClick={navigateToRegister} className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500">
            Hier registrieren.
          </a>
        </p>
      </div>


      <DialogAlert
        open={isOpenAlertDialog}
        isOpen={() => setIsOpenAlertDialog(false)}
        header={titleAlertWindow}
        content={textAlertWindow}
      />
    </div>
  );
}

export default Login;