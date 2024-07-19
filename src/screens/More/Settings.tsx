import React, { useContext } from "react";
import { Clipboard, StyleSheet } from "react-native";
import { Appbar, Divider, List } from "react-native-paper";
import Snackbar from "react-native-snackbar";

import { AuthUserContext } from "@/src/navigation/AuthUserProvider";
import { ThemeContext } from "@/src/navigation/ThemeProvider";
import { SCREENS } from "@/src/utils/constants";
import { addSampleData, logout } from "@/src/utils/helper";
import { NavigationType, ThemeColorPaletteType } from "@/src/utils/types";

const SettingsScreen = ({ navigation }: { navigation: NavigationType }) => {
    const { theme, toggleDarkMode } = useContext(ThemeContext);
    const { user, setUser } = useContext(AuthUserContext)

    const styles = useStyles(theme)

    const logoutHelper = async () => {
        try {
            const response = await logout();
            if (response) {
                setUser(null);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onPressAddSampleTask = async () => {
        await addSampleData();
        navigation.goBack();
    }

    const onPressCopy = () => {
        if (user?.email) {
            Clipboard.setString(user?.email)
            Snackbar.show({ text: 'Email copied!' })
        } else {
            Snackbar.show({ text: 'Failed to copy email' })
        }
    }

    return (
        <>
            <Appbar.Header style={styles.appBarHeader}>
                <Appbar.BackAction
                    iconColor={theme?.iconColor}
                    onPress={() => navigation.goBack()}
                />
                <Appbar.Content title={SCREENS.SETTINGS} color={theme?.headerColor} />
            </Appbar.Header>
            <List.Section style={styles.listSection}>
                <List.Subheader style={styles.listSubHeader}>General</List.Subheader>
                <List.Item
                    style={styles.listItem}
                    title="Dark Mode"
                    titleStyle={styles.listTitle}
                    right={() => (
                        <List.Icon
                            color={theme?.colorAccentSecondary}
                            icon="theme-light-dark"
                        />
                    )}
                    onPress={() => toggleDarkMode?.()}
                />
                <List.Item
                    style={styles.listItem}
                    title="Add sample task"
                    titleStyle={styles.listTitle}
                    right={() => (
                        <List.Icon
                            color={theme?.colorAccentSecondary}
                            icon="playlist-plus"
                        />
                    )}
                    onPress={onPressAddSampleTask}
                />
                <Divider />
                <List.Subheader style={styles.listSubHeader}>Account</List.Subheader>
                <List.Item
                    style={styles.listItem}
                    title={user?.email}
                    titleStyle={styles.listTitle}
                    right={() => (
                        <List.Icon
                            color={theme?.colorAccentSecondary}
                            icon="content-duplicate"
                        />
                    )}
                    onPress={onPressCopy}
                />
                <List.Item
                    style={styles.listItem}
                    title="Logout"
                    titleStyle={styles.listTitle}
                    right={() => (
                        <List.Icon
                            color={theme?.colorAccentSecondary}
                            icon="logout-variant"
                        />
                    )}
                    onPress={logoutHelper}
                />
            </List.Section >
        </>
    );
};

const useStyles = (theme: ThemeColorPaletteType | null) => StyleSheet.create({
    appBarHeader: {
        backgroundColor: theme?.colorAccentPrimary
    },
    listSection: {
        flex: 1,
        marginVertical: 0,
        backgroundColor: theme?.backgroundColor,
    },
    listSubHeader: {
        color: theme?.colorAccentSecondary,
        paddingTop: 20,
        paddingBottom: 5,
    },
    listItem: {
        paddingVertical: 0
    },
    listTitle: {
        color: theme?.textColor
    }
})

export default SettingsScreen;
