import { useState } from "react";
import { useAppDispatch } from "../hooks/redux-hooks";
import { login } from "../slices/authSlice";

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

    return (
        <>
            <div>Login</div>
            <button onClick={handleLogin}>Login</button>
        </>
    )
}
export default Login;