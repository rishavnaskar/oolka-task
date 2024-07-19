import React from "react";
import { Appbar } from "react-native-paper";

import { priorityTextColor } from "@/src/utils/priority";
import { NavigationType, ThemeColorPaletteType } from "@/src/utils/types";

interface Props {
    navigation: NavigationType
    theme: ThemeColorPaletteType | null
    priority: number
    handleAddTask: () => Promise<void>
    clearFields: () => void
    showModal: () => void
}

const AddTaskHeader = ({
    navigation,
    theme,
    priority,
    handleAddTask,
    clearFields,
    showModal,
}: Props) => {
    return (
        <Appbar.Header style={{ backgroundColor: theme?.colorAccentPrimary }}>
            <Appbar.BackAction
                iconColor={theme?.iconColor}
                onPress={() => {
                    navigation.goBack();
                    clearFields();
                }}
            />
            <Appbar.Content title="Add Task" color={theme?.headerColor} />
            <Appbar.Action icon="priority-high" iconColor={priorityTextColor(priority, theme).color} onPress={showModal} />
            <Appbar.Action
                icon="check"
                iconColor={theme?.iconColor}
                onPress={handleAddTask}
            />
        </Appbar.Header>
    );
};

export default AddTaskHeader;
