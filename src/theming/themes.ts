import { ThemeColorPaletteType } from "@/src/utils/types";

export const lightTheme: ThemeColorPaletteType = {
    colorAccentPrimary: "#8D7DFA",
    colorAccentSecondary: "#8D7DFA",
    backgroundColor: "#FAFAFA",
    priority: {
        high: "#FF0000",
        mid: "orange",
        low: "#1E90FF"
    },
    headerColor: '#FFF',
    textColor: "#484848",
    subTextColor: "#767676",
    chipColor: "#FFFFFF",
    iconColor: "#FFF",
    delete: "#E53935",
    cardBackground: "#FFFFFF",
    bottomSheet: "#FFFFFF",
    cardIcon: "#8D7DFA",
    fabGroup: "#FFFFFF",
};

export const darkTheme: ThemeColorPaletteType = {
    colorAccentPrimary: "#242529",
    colorAccentSecondary: "#8D7DFA",
    backgroundColor: "#202125",
    priority: {
        high: "#FF0000",
        mid: "orange",
        low: "#3399FF"
    },
    headerColor: '#FFF',
    textColor: "#FFFFFF",
    subTextColor: "rgba(255,255,255,0.7)",
    chipColor: "#FFFFFF",
    iconColor: "#FFFFFF",
    delete: "#E53935",
    cardBackground: "#242529",
    bottomSheet: "#242529",
    cardIcon: "#8D7DFA",
    fabGroup: "#3399ff",
};
