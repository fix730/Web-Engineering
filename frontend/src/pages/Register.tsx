import { useState } from "react";
import { useAppDispatch } from "../hooks/redux-hooks";
import { register } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { LabelOverInput } from "./components/Label";
import { Text, Email, Paasswort, DateInput } from "./components/Inputs";
import DialogAlert from "../Pop-Up-Window/alert";
import { startLoading, stopLoading } from "../slices/loadingSlice";




function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [birthday, setBirthday] = useState("");
  const [titleAlertWindow, setTitleAlertWindow] = useState("");
  const [textAlertWindow, setTextAlertWindow] = useState("");
  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && firstName && email && password && birthday && passwordConfirm && password === passwordConfirm) {
      try {
        dispatch(startLoading());

        await dispatch(
          register({
            name,
            firstName,
            email,
            password,
            birthday: new Date(birthday),
          })
        ).unwrap();
        navigate("/");
      } catch (e) {
        console.error("Registrieren fehlgeschlagen:", e);

        let errorTitle = "Registrieren fehlgeschlagen";
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
        } finally {
        dispatch(stopLoading());
      }
    } else {
      setTitleAlertWindow("Registrieren fehlgeschlagen");
      setTextAlertWindow("Bitte fülle alle Felder aus.");
      setIsOpenAlertDialog(true);
      


    }
  };

  return (
    
    
    <div
  className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
  style={{ backgroundImage: "url('/bg-login1.jpg')" }}>

  <div className="absolute top-20 flex items-center justify-center w-full">
  <div className="flex items-center space-x-4">
    <h1 className="text-5xl font-bold drop-shadow-lg">
      <span className="text-black">Find</span>
      <span className="text-red-600">DHBW</span>
    </h1>
    <img src="/finddhbwlogob.jpg" alt="DHBW Logo" className="h-16 w-auto" />
  </div>
</div>

        

      <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-10 w-full max-w-md backdrop-blur-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Register</h2>
        </div>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <LabelOverInput>First Name</LabelOverInput>
            <Text handleChnceText={(e: any) => setFirstName(e.target.value)} text={firstName} />
          </div>
          <div>
            <LabelOverInput>Last Name</LabelOverInput>
            <Text handleChnceText={(e: any) => setName(e.target.value)} text={name} />
          </div>
          <div>
            <LabelOverInput>Email</LabelOverInput>
            <Email handleChnceEmail={(e: any) => setEmail(e.target.value)} email={email} />
          </div>
          <div>
            <LabelOverInput>Password</LabelOverInput>
            <Paasswort handleChncePassword={(e: any) => setPassword(e.target.value)} password={password} autoComplete="new-password" />
          </div>
          <div>
            <LabelOverInput>Confirm password</LabelOverInput>
            <Paasswort
              handleChncePassword={(e: any) => setPasswordConfirm(e.target.value)}
              password={passwordConfirm}
              autoComplete="new-password"
            />
          </div>
          <div>
            <LabelOverInput>Date of birth</LabelOverInput>
            <DateInput handleChnceDate={(e: any) => setBirthday(e.target.value)} date={birthday} />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-indigo-600 hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>


      <DialogAlert open={isOpenAlertDialog} isOpen={() => setIsOpenAlertDialog(false)} header={titleAlertWindow} content={textAlertWindow} />
    </div>
  );
}

export default Register;