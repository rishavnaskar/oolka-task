import React, { useContext, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { ThemeContext } from "@/src/navigation/ThemeProvider";
import { ThemeColorPaletteType } from "@/src/utils/types";

interface Props {
    headerText: string
    bottomText: string
    loading: boolean
    onPressNavigation: () => void
    onPressCta: (email: string, password: string) => void
}

const LoginSingupComponent = ({
    headerText,
    bottomText,
    loading,
    onPressNavigation,
    onPressCta
}: Props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { theme } = useContext(ThemeContext)
    const styles = useStyles(theme)

    const onPressCtaHelper = () => {
        onPressCta(email, password)
    }

    return (
        <View style={styles.wrapper}>
            <ScrollView style={styles.avoidView}>
                <Text style={styles.loginHeader}>{headerText}</Text>
                <Text style={styles.labelText}>E-mail</Text>
                <TextInput
                    textContentType="emailAddress"
                    cursorColor={theme?.textColor}
                    style={styles.textInput}
                    onChangeText={(email) => setEmail(email)}
                />
                <Text style={styles.labelText}>Password</Text>
                <TextInput
                    textContentType="password"
                    cursorColor={theme?.textColor}
                    secureTextEntry={true}
                    style={styles.textInput}
                    onChangeText={(password) => setPassword(password)}
                />
                <Text
                    style={styles.navigateText}
                    onPress={onPressNavigation}
                >
                    {` Already have an account? ${bottomText}`}
                </Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={theme?.chipColor}
                        animating={loading}
                    />
                </View>
            </ScrollView>
            <View style={styles.buttonWrapper}>
                <TouchableHighlight style={styles.button} onPress={onPressCtaHelper}>
                    <Icon
                        name="angle-right"
                        color={theme?.colorAccentPrimary}
                        size={32}
                        style={styles.icon}
                    />
                </TouchableHighlight>
            </View>
        </View>
    );
}

export default LoginSingupComponent

const useStyles = (theme: ThemeColorPaletteType | null) => {
    return StyleSheet.create({
        wrapper: {
            display: "flex",
            flex: 1,
            backgroundColor: theme?.colorAccentPrimary,
            paddingTop: 70,
        },
        avoidView: {
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 20,
            flex: 1,
        },
        loginHeader: {
            fontSize: 28,
            color: theme?.textColor,
            fontWeight: "300",
            marginBottom: 40,
        },
        labelText: {
            fontWeight: "700",
            marginBottom: 10,
            fontSize: 14,
            color: theme?.textColor,
        },
        textInput: {
            color: theme?.textColor,
            borderBottomColor: theme?.textColor,
            borderBottomWidth: 1,
            paddingTop: 5,
            paddingBottom: 5,
            marginBottom: 30,
        },
        buttonWrapper: {
            alignItems: "flex-end",
            right: 20,
            bottom: 20,
            paddingTop: 0,
        },
        button: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            width: 60,
            height: 60,
            backgroundColor: theme?.chipColor,
        },
        icon: {
            marginRight: -2,
            marginTop: -2,
        },
        navigateText: {
            color: theme?.chipColor,
            fontSize: 15,
            textAlign: "center",
        },
        loadingContainer: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
            marginTop: 20,
        }
    });
};