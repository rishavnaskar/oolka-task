import React, { useContext, useState } from "react";
import Snackbar from "react-native-snackbar";

import LoginSingupComponent from "@/src/components/LoginSignupComponent";
import { AuthUserContext } from "@/src/navigation/AuthUserProvider";
import { SCREENS } from "@/src/utils/constants";
import { loginUser } from "@/src/utils/helper";
import { NavigationType } from "@/src/utils/types";

const LoginScreen = ({ navigation }: { navigation: NavigationType }) => {
    const [loading, setLoading] = useState(false);

    const { setUser } = useContext(AuthUserContext)

    const onPressNavigation = () => {
        navigation.navigate(SCREENS.SIGNUP)
    }

    const onPressCta = async (email: string, password: string) => {
        setLoading(true);
        const response = await loginUser(email, password);
        if (response) {
            setUser(response)
            Snackbar.show({ text: 'Logged in successfully!' });
        }
        setLoading(false);
    };

    return <LoginSingupComponent
        headerText="Login"
        bottomText="Sign Up"
        loading={loading}
        onPressNavigation={onPressNavigation}
        onPressCta={onPressCta}
    />
}

export default LoginScreen