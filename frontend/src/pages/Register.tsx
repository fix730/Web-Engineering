import { useState } from "react";
import { useAppDispatch } from "../hooks/redux-hooks";
import { register } from "../slices/authSlice";

function Register() {
    const dispatch = useAppDispatch();

    const [name, setName] = useState("1");
    const [firstName, setFirstName] = useState("1");
    const [email, setEmail] = useState("1");
    const [password, setPassword] = useState("test123");
    const [birthday, setBirthday] = useState<Date>(new Date());

    const handleRegister = async () => {
        // This is only a basic validation of inputs. Improve this as needed.
        if (name && email && password && birthday) {
            try {
                await dispatch(
                    register({
                        name,
                        firstName,
                        email,
                        password,
                        birthday
                })
                ).unwrap();
            } catch (e) {
                console.error(e);
            }
        } else {
            // Show an error message.
        }
    };


    return (
        <>
            <div>Registrieren</div>
            <button onClick={handleRegister}>Reg</button>
        </>
    );
}
export default Register;