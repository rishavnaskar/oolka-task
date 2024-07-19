import React, { useContext, useState } from "react";
import Snackbar from "react-native-snackbar";

import LoginSingupComponent from "@/src/components/LoginSignupComponent";
import { AuthUserContext } from "@/src/navigation/AuthUserProvider";
import { SCREENS } from "@/src/utils/constants";
import { signupUser } from "@/src/utils/helper";
import { NavigationType } from "@/src/utils/types";

const SignupScreen = ({ navigation }: { navigation: NavigationType }) => {
    const [loading, setLoading] = useState(false);

    const { setUser } = useContext(AuthUserContext)

    const onPressNavigation = () => {
        navigation.navigate(SCREENS.LOGIN)
    }

    const onPressCta = async (email: string, password: string) => {
        setLoading(true);
        const response = await signupUser(email, password);
        if (response) {
            setUser(response)
            Snackbar.show({ text: 'Signed up successfully!' })
        }
        setLoading(false);
    };

    return (
        <LoginSingupComponent
            headerText="Sign Up"
            bottomText="Login"
            loading={loading}
            onPressNavigation={onPressNavigation}
            onPressCta={onPressCta}
        />
    );
}

export default SignupScreen