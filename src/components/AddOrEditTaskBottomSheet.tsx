import React, { useState } from "react";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { RadioButton, Switch, TouchableRipple } from "react-native-paper";
import BottomSheet from "rn-sliding-up-panel";

import { ThemeColorPaletteType } from "@/src/utils/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Props {
    bottomSheetRef: React.RefObject<BottomSheet>
    theme: ThemeColorPaletteType | null
    priority: number
    category: string
    isChecked: boolean
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>
    setPriority: React.Dispatch<React.SetStateAction<number>>
    setCategory: React.Dispatch<React.SetStateAction<string>>
}

const AddOrEditTaskBottomSheet = ({
    bottomSheetRef,
    theme,
    priority,
    category,
    isChecked,
    setIsChecked,
    setPriority,
    setCategory
}: Props) => {
    const [categoryText, setCategoryText] = useState(category);

    const styles = useStyles(theme);

    const onChangeText = (val: string) => {
        setCategoryText(val)
    }
    const onPressCategoryCta = () => {
        bottomSheetRef.current?.hide()
        Keyboard.dismiss()
        setCategory(categoryText)
    }
    const handleIsCompleted = () => {
        setIsChecked(!isChecked)
    }

    return <BottomSheet
        ref={bottomSheetRef}
        draggableRange={{ top: 380, bottom: 0 }}
        snappingPoints={[0, 120, 280]}
        showBackdrop={true}

    >
        <View style={styles.bottomSheetContainer}>
            <View style={styles.indicator} />
            <Text style={styles.priorityHeading}>Completed</Text>
            <TouchableRipple
                style={styles.setPriority}
                onPress={handleIsCompleted}
            >
                <>
                    <Text style={{ fontSize: 15, color: theme?.textColor }}>
                        Set completed
                    </Text>
                    <Switch
                        value={isChecked}
                        onValueChange={handleIsCompleted}
                        color={theme?.colorAccentSecondary}
                    />
                </>
            </TouchableRipple>
            <Text
                style={styles.priorityHeading}
            >
                Priority
            </Text>
            <RadioButton.Group
                onValueChange={(newValue) => setPriority(+newValue)}
                value={priority.toString()}
            >
                <RadioButton.Item
                    label="High"
                    value={'1'}
                    color={theme?.priority.high}
                    uncheckedColor={theme?.priority.high}
                    style={{ paddingHorizontal: 20, paddingRight: 35 }}
                    labelStyle={{ color: theme?.textColor }}
                />
                <RadioButton.Item
                    label="Medium"
                    value={'2'}
                    color={theme?.priority.mid}
                    uncheckedColor={theme?.priority.mid}
                    style={{ paddingHorizontal: 20, paddingRight: 35 }}
                    labelStyle={{ color: theme?.textColor }}
                />
                <RadioButton.Item
                    label="Low"
                    value={'3'}
                    color={theme?.priority.low}
                    uncheckedColor={theme?.priority.low}
                    style={{ paddingHorizontal: 20, paddingRight: 35 }}
                    labelStyle={{ color: theme?.textColor }}
                />
            </RadioButton.Group>
            <Text style={[styles.priorityHeading, styles.categoryHeading]}>
                Category
            </Text>
            <View style={styles.categoryInputContainer}>
                <Icon name="label" size={22} color={theme?.subTextColor} />
                <TextInput
                    value={categoryText}
                    style={styles.categoryInput}
                    onChangeText={onChangeText}
                    onSubmitEditing={onPressCategoryCta}
                />
                <Text style={styles.ctaText} onPress={onPressCategoryCta}>Done</Text>
            </View>
        </View>
    </BottomSheet>
}

const useStyles = (theme: ThemeColorPaletteType | null) => StyleSheet.create({
    bottomSheetContainer: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 8,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 10,
        backgroundColor: theme?.bottomSheet
    },
    priorityHeading: {
        fontWeight: "bold",
        fontSize: 15,
        color: theme?.colorAccentSecondary,
        paddingHorizontal: 20,
    },
    categoryHeading: {
        marginTop: 16,
    },
    setPriority: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingRight: 35,
        paddingVertical: 10,
        marginBottom: 16,
    },
    indicator: {
        position: "absolute",
        justifyContent: "center",
        alignSelf: "center",
        width: 40,
        height: 5,
        backgroundColor: "rgba(0,0,0,0.75)",
        borderRadius: 25,
        top: 7,
    },
    categoryInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    categoryInput: {
        marginVertical: 16,
        marginHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: theme?.subTextColor,
        flex: 1,
    },
    ctaText: {
        color: theme?.colorAccentPrimary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme?.colorAccentPrimary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        fontWeight: 'bold'
    }
})

export default AddOrEditTaskBottomSheet;