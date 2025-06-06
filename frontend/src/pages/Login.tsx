import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/redux-hooks";
import { login } from "../slices/authSlice";
import{Button} frm

function Login() {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("1");
    const [password, setPassword] = useState("test123");

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

    

    return (
        <>
            <div>Login</div>
            <input onChange={handleChnceEmail} value={email} type="text" placeholder="Email" />
            <button onClick={handleLogin}>Login</button>
            
        </>
    )
}
export default Login;