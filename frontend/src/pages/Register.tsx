import { useState } from "react";
import { useAppDispatch } from "../hooks/redux-hooks";
import { register } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { LabelOverInput } from "./components/Label";
import { Text, Email, Paasswort, DateInput } from "./components/Inputs";


function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [birthday, setBirthday] = useState("");


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && firstName && email && password && birthday && passwordConfirm && password === passwordConfirm) {
      try {
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
        console.error(e);
      }
    } else {
      alert("Bitte alle Felder ausfüllen.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Registrieren</h2>
        </div>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <LabelOverInput>Vorname</LabelOverInput>
            <Text handleChnceText={(e:any) => setFirstName(e.target.value)} text={firstName} />
          </div>
          <div>
            <LabelOverInput>Nachname</LabelOverInput>
            <Text handleChnceText={(e:any) => setName(e.target.value)} text={name} />
          </div>
          <div>
            <LabelOverInput>E-Mail</LabelOverInput>
            <Email handleChnceEmail={(e:any) => setEmail(e.target.value)} email={email} />
          </div>
          <div>
            <LabelOverInput>Passwort</LabelOverInput>
            <Paasswort handleChncePassword={(e:any)=> setPassword(e.target.value)} password={password} autoComplete="new-password" />
          </div>
          <div>
            <LabelOverInput>Passwort bestätigen</LabelOverInput>
            <Paasswort
              handleChncePassword={(e:any) => setPasswordConfirm(e.target.value)}
              password={passwordConfirm}
              autoComplete="new-password"
            />
          </div>
          <div>
            <LabelOverInput>Geburtsdatum</LabelOverInput>
            <DateInput handleChnceDate={(e:any) => setBirthday(e.target.value)} date={birthday} />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500"
          >
            Registrieren
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Bereits ein Konto?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-indigo-600 hover:underline"
          >
            Anmelden
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;