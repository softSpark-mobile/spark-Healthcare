import SignUpScreen from "./SigninScreen";
import LoginScreen from "./LoginScreen";
import { useState } from "react";

const Auth = () => {
    const [signFlag, setSignFlag] = useState<boolean>(false);

    console.log("signupFlag: ", signFlag);
    
    
    return signFlag ? (
        <SignUpScreen setSignFlag={setSignFlag}/>
    ) : (
        <LoginScreen setSignFlag={setSignFlag}/>
    );
}
 
export default Auth;