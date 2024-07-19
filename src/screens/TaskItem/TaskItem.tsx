import moment from "moment";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
    Appbar,
    Button,
    Dialog,
    FAB,
    Portal,
    Provider
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { ThemeContext } from "@/src/navigation/ThemeProvider";
import { SCREENS } from "@/src/utils/constants";
import { deleteTask } from "@/src/utils/helper";
import { getPriorityText, priorityTextColor } from "@/src/utils/priority";
import { NavigationType, TaskItemType, ThemeColorPaletteType } from "@/src/utils/types";

interface Props {
    navigation: NavigationType
    route: { params: TaskItemType }
}

export default function TaskItem({ route, navigation }: Props) {
    const {
        id,
        taskTitle,
        taskContent,
        taskTime,
        isCompleted,
        createdAt,
        category = 'General',
        priorityIs
    } = route?.params ?? {};


    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const { theme } = useContext(ThemeContext);
    const styles = useStyles(theme, priorityIs);

    const onStateChange = () => setOpen(!open);

    const handleDivider = () => {
        if (taskTime || taskContent !== "") {
            return { borderBottomWidth: 1, borderBottomColor: "#E8E8E8" };
        }
    };

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    const handleDelete = async (id: string) => {
        const response = await deleteTask(id);
        if (response) {
            hideDialog();
            navigation.goBack()
        } else {
            console.error('Failed to delete')
        }
    };

    return (
        <Provider>
            <Appbar.Header
                style={{ backgroundColor: theme?.colorAccentPrimary }}
            >
                <Appbar.BackAction
                    color={theme?.iconColor}
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
                <Appbar.Content title="Task Item" color={theme?.headerColor} />
            </Appbar.Header>
            <Portal>
                <Dialog
                    visible={visible}
                    onDismiss={hideDialog}
                    style={{
                        backgroundColor: theme?.backgroundColor,
                        width: 320,
                        alignSelf: "center",
                        borderRadius: 15,
                    }}
                >
                    <Dialog.Content>
                        <Text style={{ fontSize: 16, color: theme?.textColor }}>
                            The note will be deleted
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={hideDialog}
                            color={theme?.colorAccentSecondary}
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={() => handleDelete(id)}
                            color={theme?.colorAccentSecondary}
                        >
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <View style={{ flex: 1, backgroundColor: theme?.backgroundColor }}>
                <ScrollView
                    style={[
                        styles.mainContainer,
                        { backgroundColor: theme?.cardBackground },
                        taskContent === "" && { paddingBottom: 15 },
                    ]}
                >
                    <View style={handleDivider()}>
                        <Text
                            style={[
                                styles.taskTitle,
                                isCompleted && { textDecorationLine: "line-through" }]}
                        >
                            {taskTitle}
                        </Text>
                    </View>
                    <View style={styles.middleContainer}>
                        <View style={styles.categoryContainer}>
                            <Icon name="label" size={18} color={theme?.subTextColor} />
                            <Text style={styles.categoryText}>{category}</Text>
                        </View>
                        {taskTime && (
                            <Text
                                style={[
                                    styles.taskDate,
                                    { color: theme?.textColor },
                                ]}
                            >
                                Due {moment(taskTime).calendar()}
                            </Text>
                        )}
                    </View>
                    {taskContent !== "" && (
                        <View>
                            <Text
                                style={[styles.taskContent, !taskTime && { paddingTop: 10 }]}
                            >
                                {taskContent}
                            </Text>
                        </View>
                    )}
                    <View style={styles.bottomContainer}>
                        <Text style={[styles.createdDate]}>
                            {moment(createdAt).calendar()}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.priorityLabel}>Priority:  </Text>
                            <Text style={styles.priorityText}>{getPriorityText(priorityIs)}</Text>
                        </View>
                    </View>
                </ScrollView>
                <Portal>
                    <FAB.Group
                        visible={true}
                        open={open}
                        color="white"
                        fabStyle={{ backgroundColor: theme?.colorAccentSecondary }}
                        icon={open ? "dots-vertical" : "dots-horizontal"}
                        backdropColor={'rgba(32, 33, 37, 0.7)'}
                        actions={[

                            {
                                icon: "trash-can-outline",
                                color: theme?.colorAccentSecondary,
                                label: "Delete",
                                labelTextColor: theme?.subTextColor,
                                onPress: showDialog,
                                style: { backgroundColor: theme?.backgroundColor },
                            },
                            {
                                icon: "pencil",
                                label: "Edit",
                                color: theme?.colorAccentSecondary,
                                labelTextColor: theme?.subTextColor,
                                onPress: () =>
                                    navigation.navigate(SCREENS.EDIT_TASK, route.params),
                                style: {
                                    backgroundColor: theme?.backgroundColor,
                                },
                            },
                        ]}
                        onStateChange={onStateChange}
                    />
                </Portal>
            </View>
        </Provider>
    );
}

const useStyles = (theme: ThemeColorPaletteType | null, priority: number) => StyleSheet.create({
    mainContainer: {
        marginTop: 20,
        margin: 10,
        paddingHorizontal: 20,
        paddingTop: 15,
        elevation: 2,
        borderRadius: 15,
    },
    taskTitle: {
        fontWeight: "700",
        fontSize: 36,
        paddingTop: 5,
        paddingBottom: 10,
        color: theme?.textColor,
    },
    taskDate: {
        paddingVertical: 10,
        fontSize: 14,
    },
    createdDate: {
        fontSize: 14,
        color: theme?.subTextColor
    },
    taskContent: {
        fontSize: 18,
        lineHeight: 29,
        paddingBottom: 15,
        color: theme?.subTextColor,
    },
    middleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryContainer: {
        flexDirection: 'row',
        marginTop: 8
    },
    categoryText: {
        color: theme?.subTextColor,
        textTransform: 'capitalize',
        marginStart: 8,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        paddingBottom: 20,
    },
    priorityLabel: {
        color: theme?.subTextColor,
        fontSize: 14,
    },
    priorityText: {
        color: priorityTextColor(priority, theme).color,
        fontSize: 14,
        fontWeight: 'bold'
    }
});
