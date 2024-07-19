import moment from "moment";
import React, { useContext, useRef, useState } from "react";
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
    Provider
} from "react-native-paper";
import Snackbar from "react-native-snackbar";
import BottomSheet from "rn-sliding-up-panel";

import Appbar from "@/src/components/AddTaskHeader";
import { ThemeContext } from "@/src/navigation/ThemeProvider";
import { addTask, getRandomId } from "@/src/utils/helper";
import { NavigationType, ThemeColorPaletteType } from "@/src/utils/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AddOrEditTaskBottomSheet from "../../components/AddOrEditTaskBottomSheet";

export default function AddTask({ navigation }: { navigation: NavigationType }) {
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskContent, setNewTaskContent] = useState("");
    const [priority, setPriority] = useState(2);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [chosenDate, setChosenDate] = useState<Date | null>(null);
    const [category, setCategory] = useState('General');
    const [isChecked, setIsChecked] = useState(false);

    const priorityAndCategoryBottomSheetRef = useRef<BottomSheet>(null)

    const { theme } = useContext(ThemeContext);
    const styles = useStyles(theme)
    const now = new Date();

    const showBottomSheet = () => {
        Keyboard.dismiss();
        priorityAndCategoryBottomSheetRef.current?.show({ toValue: 380, velocity: 0.8 })
    }

    const handleAddTask = async () => {
        if (newTaskTitle === "") {
            Snackbar.show({ text: "Please fill all the details" });
        } else {
            const response = await addTask({
                taskTitle: newTaskTitle,
                taskContent: newTaskContent,
                priorityIs: priority,
                collaborators: [],
                createdAt: moment(),
                id: getRandomId(),
                isCompleted: isChecked,
                isUpdated: false,
                taskTime: moment(chosenDate),
                category,
            });
            if (response) {
                Snackbar.show({ text: "Task Added" })
                clearFields();
                navigation.goBack();
            } else {
                Snackbar.show({ text: "Cannot add task at this moment. Please try again later..." })
            }
        }
    };

    const clearFields = () => {
        setNewTaskTitle("");
        setNewTaskContent("");
        setChosenDate(null);
    };

    const handlePicker = (date: Date) => {
        setChosenDate(date);
        setIsDatePickerVisible(false);
    };
    const showPicker = () => setIsDatePickerVisible(true);

    const hidePicker = () => setIsDatePickerVisible(false);

    return (
        <Provider>
            <Appbar
                navigation={navigation}
                theme={theme}
                priority={priority}
                handleAddTask={handleAddTask}
                clearFields={clearFields}
                showModal={showBottomSheet}
            />
            <View
                style={[
                    styles.mainContainer,
                    { backgroundColor: theme?.backgroundColor },
                ]}
            >
                <View style={{ flex: 1 }}>
                    <TextInput
                        multiline={true}
                        style={[styles.titleInput, { color: theme?.textColor }]}
                        placeholder="Title"
                        onChangeText={(text) => setNewTaskTitle(text)}
                        defaultValue={newTaskTitle}
                        placeholderTextColor={theme?.subTextColor}
                    />

                    <View style={styles.middleInfoContainer}>
                        <TouchableOpacity style={styles.categoryTextContainer} onPress={showBottomSheet}>
                            <Icon name="label" size={18} color={theme?.subTextColor} />
                            <Text style={styles.categoryText}>{category}</Text>
                        </TouchableOpacity>
                        <Text
                            onPress={showPicker}
                            style={{ color: theme?.subTextColor }}
                        >
                            {chosenDate
                                ? moment(chosenDate).calendar()
                                : "Reminder Time"}
                        </Text>
                    </View>
                    <TextInput
                        style={[
                            styles.contentInput,
                            { color: theme?.textColor },
                        ]}
                        onChangeText={(text) => setNewTaskContent(text)}
                        placeholder="Describe this task in a few lines..."
                        defaultValue={newTaskContent}
                        multiline={true}
                        placeholderTextColor={theme?.subTextColor}
                    />
                </View>
                <DateTimePickerModal
                    mode="datetime"
                    isVisible={isDatePickerVisible}
                    is24Hour={false}
                    onConfirm={handlePicker}
                    onCancel={hidePicker}
                    minimumDate={now}
                />
            </View>
            <AddOrEditTaskBottomSheet
                bottomSheetRef={priorityAndCategoryBottomSheetRef}
                priority={priority}
                theme={theme}
                category={category}
                isChecked={isChecked}
                setIsChecked={setIsChecked}
                setPriority={setPriority}
                setCategory={setCategory}
            />
        </Provider >
    );
}

const useStyles = (theme: ThemeColorPaletteType | null) => {
    return StyleSheet.create({
        mainContainer: {
            flex: 1,
            padding: 10,
        },
        titleInput: {
            fontSize: 30,
            fontWeight: "bold",
            paddingVertical: 15,
            marginHorizontal: 10,
            borderBottomWidth: 1.2,
            borderBottomColor: "#E8E8E8",
        },
        contentInput: {
            paddingTop: 20,
            marginHorizontal: 10,
            fontSize: 18,
            lineHeight: 29,
        },
        checkBox: {
            borderRadius: 10,
            borderWidth: 0,
        },
        middleInfoContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 10,
            paddingTop: 5
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
};
