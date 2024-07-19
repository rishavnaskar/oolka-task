import React, { useContext } from "react";
import { Appbar } from "react-native-paper";

import { ThemeContext } from "@/src/navigation/ThemeProvider";
import { SCREENS } from "@/src/utils/constants";
import { NavigationType } from "@/src/utils/types";

interface Props {
    navigation: NavigationType;
    handleSearch: () => void;
    handleSlider: () => void;
}

const Header = ({ navigation, handleSearch, handleSlider }: Props) => {
    const { theme } = useContext(ThemeContext);

    return (
        <Appbar.Header style={{ backgroundColor: theme?.colorAccentPrimary }}>
            <Appbar.Content title={SCREENS.YOUR_TASKS} color={theme?.headerColor} />
            <Appbar.Action icon='magnify' color={theme?.iconColor} onPress={handleSearch} />
            <Appbar.Action icon="filter-variant" color={theme?.iconColor} onPress={handleSlider} />
            <Appbar.Action icon="cog-outline" color={theme?.iconColor} onPress={() => navigation.navigate(SCREENS.SETTINGS)} />
        </Appbar.Header>
    );
};

export default Header;
