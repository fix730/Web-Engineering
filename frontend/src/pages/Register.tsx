import { useState } from "react";
import { useAppDispatch } from "../hooks/redux-hooks";
import { register } from "../slices/authSlice";

function Register() {
    const dispatch = useAppDispatch();

    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div>Registrieren</div>
    );
}
export default Register;