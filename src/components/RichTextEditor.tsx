import React, { useRef } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

import { ThemeColorPaletteType } from "@/src/utils/types";

interface Props {
    theme: ThemeColorPaletteType | null
    newTaskContent: string
    disabled?: boolean
    containerStyle?: StyleProp<ViewStyle>
    setNewTaskContent?: React.Dispatch<React.SetStateAction<string>>
}

const RichTextEditor = ({
    containerStyle,
    theme,
    newTaskContent,
    disabled = false,
    setNewTaskContent
}: Props) => {
    const richText = useRef<RichEditor>(null);

    const styles = useStyles(theme)

    const onChangeText = (val: string) => {
        setNewTaskContent?.(val)
    }

    return <SafeAreaView style={[styles.flexOne, containerStyle]}>
        <ScrollView>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flexOne}
            >
                <RichEditor
                    ref={richText}
                    initialFocus={false}
                    firstFocusEnd={false}
                    placeholder="Describe the content in a few lines..."
                    style={styles.flexAndFlexGrow}
                    editorStyle={{
                        backgroundColor: disabled ? theme?.cardBackground : theme?.backgroundColor,
                        color: theme?.textColor,
                        placeholderColor: theme?.subTextColor
                    }}
                    containerStyle={styles.flexAndFlexGrow}
                    styleWithCSS={true}
                    disabled={disabled}
                    initialContentHTML={newTaskContent}
                    onChange={onChangeText}
                />
            </KeyboardAvoidingView>
        </ScrollView>
        {disabled ? null : <RichToolbar
            editor={richText}
            style={styles.richToolBar}
            iconTint={theme?.textColor}
        />}
    </SafeAreaView>
}

const useStyles = (theme: ThemeColorPaletteType | null) => StyleSheet.create({
    flexOne: {
        flex: 1,
    },
    flexAndFlexGrow: {
        flex: 1,
        flexGrow: 1,
    },
    richToolBar: {
        backgroundColor: theme?.backgroundColor
    },
    unselectedButtonStyle: {
        color: 'green'
    }
})

export default RichTextEditor