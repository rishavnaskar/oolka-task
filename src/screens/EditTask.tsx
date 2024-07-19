import moment from "moment";
import React, { useContext, useRef, useState } from "react";
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
    Appbar,
    Provider
} from "react-native-paper";
import Snackbar from "react-native-snackbar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { default as SlidingUpPanel } from "rn-sliding-up-panel";

import { ThemeContext } from "@/src/navigation/ThemeProvider";
import { updateTask } from "@/src/utils/helper";
import { NavigationType, TaskItemType, ThemeColorPaletteType } from "@/src/utils/types";
import AddOrEditTaskBottomSheet from "../components/AddOrEditTaskBottomSheet";
import RichTextEditor from "../components/RichTextEditor";
import { priorityTextColor } from "../utils/priority";


interface Props {
    navigation: NavigationType;
    route: { params: TaskItemType }
}

export default function EditTask({ route, navigation }: Props) {
    const taskProps = route.params;
    const {
        taskTitle,
        taskTime,
        taskContent = '',
        isCompleted,
        priorityIs,
        category = 'General',
    } = taskProps

    const [newTaskTitle, setNewTaskTitle] = useState(taskTitle);
    const [newTaskContent, setNewTaskContent] = useState(taskContent);
    const [isChecked, setIsChecked] = useState(isCompleted);
    const [isVisible, setIsVisible] = useState(false);
    const [chosenDate, setChosenDate] = useState(taskTime);
    const [priority, setPriority] = useState(priorityIs);
    const [chosenCategory, setChosenCategory] = useState(category)

    const bottomSheetRef = useRef<SlidingUpPanel>(null);
    const categoryTextInputRef = useRef<TextInput>(null)

    const { theme } = useContext(ThemeContext);
    const styles = useStyles(theme)

    const handlePicker = (date: Date) => {
        setChosenDate(moment(date));
        setIsVisible(false);
    };

    const showPicker = () => setIsVisible(true);

    const hidePicker = () => setIsVisible(false);

    const showBottomSheet = (isSourceCategory = false) => {
        if (isSourceCategory) {
            categoryTextInputRef.current?.focus()
        } else {
            Keyboard.dismiss();
        }
        bottomSheetRef.current?.show({ toValue: 380, velocity: 0.8 })
    }

    const handleEditTask = async () => {
        Keyboard.dismiss()
        if (newTaskTitle === "") {
            Snackbar.show({ text: "Please fill all the details" });
        } else {
            const response = await updateTask({
                ...taskProps,
                taskTitle: newTaskTitle,
                taskContent: newTaskContent,
                priorityIs: priority,
                taskTime: chosenDate,
                isCompleted: isChecked,
                category: chosenCategory
            })
            if (response) {
                Snackbar.show({ text: 'Task Updated' })
                navigation.pop(2)
            } else {
                Snackbar.show({ text: "Cannot edit this task at this moment. Please try again later..." })
            }
        }
    };

    return (
        <Provider>
            <Appbar.Header style={styles.appBarHeader}>
                <Appbar.BackAction
                    iconColor={theme?.iconColor}
                    onPress={() => navigation.goBack()}
                />
                <Appbar.Content title="Edit Task" color={theme?.headerColor} />
                <Appbar.Action
                    icon="priority-high"
                    iconColor={priorityTextColor(priority, theme).color}
                    onPress={() => showBottomSheet()}
                />
                <Appbar.Action
                    icon="check"
                    iconColor={theme?.iconColor}
                    onPress={handleEditTask}
                />
            </Appbar.Header>
            <View style={styles.mainContainer}>
                <ScrollView>
                    <TextInput
                        multiline={true}
                        style={[
                            styles.titleInput,
                            { textDecorationLine: isChecked ? 'line-through' : 'none' },
                        ]}
                        placeholder="Title"
                        onChangeText={(text) => setNewTaskTitle(text)}
                        defaultValue={newTaskTitle}
                        placeholderTextColor={theme?.subTextColor}
                    />
                    <View style={styles.middleContainer}>
                        <TouchableOpacity style={styles.categoryTextContainer} onPress={() => showBottomSheet(true)}>
                            <Icon name="label" size={18} color={theme?.subTextColor} />
                            <Text style={styles.categoryText}>{chosenCategory}</Text>
                        </TouchableOpacity>
                        <Text onPress={showPicker} style={styles.dateInput}>
                            {chosenDate
                                ? moment(chosenDate).calendar()
                                : "Reminder Time"}
                        </Text>
                    </View>
                    <RichTextEditor
                        theme={theme}
                        newTaskContent={newTaskContent}
                        setNewTaskContent={setNewTaskContent}
                    />
                </ScrollView>
                <DateTimePickerModal
                    isVisible={isVisible}
                    onConfirm={handlePicker}
                    onCancel={hidePicker}
                    mode="datetime"
                    is24Hour={false}
                />
            </View>
            <AddOrEditTaskBottomSheet
                bottomSheetRef={bottomSheetRef}
                category={chosenCategory}
                isChecked={isChecked}
                priority={priority}
                theme={theme}
                categoryTextInputRef={categoryTextInputRef}
                setCategory={setChosenCategory}
                setIsChecked={setIsChecked}
                setPriority={setPriority}
            />
        </Provider >
    );
}

const useStyles = (theme: ThemeColorPaletteType | null) => StyleSheet.create({
    appBarHeader: {
        backgroundColor: theme?.colorAccentPrimary
    },
    mainContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: theme?.backgroundColor
    },
    dateInput: {
        paddingTop: 5,
        color: theme?.subTextColor
    },
    titleInput: {
        fontSize: 30,
        fontWeight: "bold",
        paddingVertical: 15,
        marginHorizontal: 10,
        borderBottomWidth: 1.2,
        borderBottomColor: "#E8E8E8",
        color: theme?.textColor,
    },
    contentInput: {
        paddingTop: 10,
        marginHorizontal: 10,
        fontSize: 18,
        lineHeight: 29,
        color: theme?.subTextColor
    },
    checkBox: {
        borderRadius: 10,
        borderWidth: 0,
    },
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
        paddingHorizontal: 20,
        paddingVertical: 5,
        color: theme?.colorAccentSecondary
    },
    setPriority: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
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
    setCompleted: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    middleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 4,
        marginBottom: 8,
    },
    categoryTextContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    categoryText: {
        color: theme?.subTextColor,
        textTransform: 'capitalize',
        marginStart: 8,
    }
});
